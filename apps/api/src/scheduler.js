import cron from 'node-cron';

/**
 * Article Generation Scheduler
 * Handles automated article generation based on configured frequency and topics
 * 
 * IMPORTANT: All times are scheduled in CST (America/Chicago timezone)
 * This includes automatic handling of CDT (Central Daylight Time) during DST
 */

class ArticleScheduler {
  constructor(pool, generateArticleFunction) {
    this.pool = pool;
    this.generateArticle = generateArticleFunction;
    this.currentTask = null;
    this.currentSchedule = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the scheduler by loading settings from database
   */
  async initialize() {
    try {
      console.log('🕐 Initializing Article Scheduler...');
      
      const settings = await this.loadSettings();
      
      if (!settings) {
        console.log('⚠️  No settings found. Scheduler will remain inactive until settings are configured.');
        this.isInitialized = true;
        return;
      }
      
      if (!settings.auto) {
        console.log('⏸️  Automatic generation is disabled. Scheduler inactive.');
        this.isInitialized = true;
        return;
      }
      
      if (!settings.topics || settings.topics.length === 0) {
        console.log('⚠️  No topics configured. Scheduler inactive until topics are added.');
        this.isInitialized = true;
        return;
      }
      
      // Set up the cron job
      await this.updateSchedule(settings.schedule, settings.topics);
      
      console.log('✅ Article Scheduler initialized successfully');
      console.log(`   Schedule: ${settings.schedule} (CST)`);
      console.log(`   Topics: ${settings.topics.length} configured`);
      console.log(`   Timezone: America/Chicago (CST/CDT)`);
      console.log(`   Next run: ${this.getNextRun()}`);
      
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize scheduler:', error);
      this.isInitialized = true; // Mark as initialized even on error to prevent blocking
    }
  }

  /**
   * Load settings from database
   */
  async loadSettings() {
    try {
      const result = await this.pool.query(
        'SELECT topics, schedule, auto FROM articles_settings ORDER BY id LIMIT 1'
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error loading scheduler settings:', error);
      return null;
    }
  }

  /**
   * Update the schedule (called when settings are changed)
   */
  async updateSchedule(cronExpression, topics) {
    // Stop existing task if running
    if (this.currentTask) {
      this.currentTask.stop();
      console.log('🛑 Stopped previous scheduler task');
    }
    
    // Validate cron expression
    if (!cron.validate(cronExpression)) {
      console.error(`❌ Invalid cron expression: ${cronExpression}`);
      return false;
    }
    
    // Store current schedule
    this.currentSchedule = cronExpression;
    
    // Create new scheduled task with CST timezone
    this.currentTask = cron.schedule(cronExpression, async () => {
      await this.executeScheduledGeneration();
    }, {
      timezone: 'America/Chicago' // CST/CDT timezone
    });
    
    console.log('✅ Scheduler updated successfully');
    console.log(`   Schedule: ${cronExpression} (CST)`);
    console.log(`   Next run: ${this.getNextRun()}`);
    
    return true;
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.currentTask) {
      this.currentTask.stop();
      this.currentTask = null;
      console.log('🛑 Scheduler stopped');
    }
  }

  /**
   * Execute scheduled article generation
   */
  async executeScheduledGeneration() {
    try {
      console.log('\n🤖 ===== SCHEDULED ARTICLE GENERATION =====');
      console.log(`Time: ${new Date().toISOString()}`);
      
      // Load fresh settings to ensure auto is still enabled
      const settings = await this.loadSettings();
      
      if (!settings || !settings.auto) {
        console.log('⏸️  Automatic generation is disabled. Skipping generation.');
        return;
      }
      
      if (!settings.topics || settings.topics.length === 0) {
        console.log('⚠️  No topics available. Skipping generation.');
        return;
      }
      
      // Select random topic
      const randomTopic = settings.topics[Math.floor(Math.random() * settings.topics.length)];
      console.log(`📝 Selected random topic: "${randomTopic}"`);
      
      // Generate job ID
      const jobId = `scheduled-${Date.now()}`;
      
      // Generate article parameters (same as manual generation)
      const params = {
        topic: randomTopic,
        inputType: 'topic',
        featured: false // Scheduled articles are not featured by default
      };
      
      console.log('🚀 Starting article generation...');
      
      // Call the generation function (same as manual generation)
      await this.generateArticle(params, jobId);
      
      console.log('✅ Scheduled generation completed successfully');
      console.log(`Next run: ${this.getNextRun()}`);
      console.log('==========================================\n');
      
    } catch (error) {
      console.error('❌ Error in scheduled generation:', error);
      console.log('==========================================\n');
    }
  }

  /**
   * Manually trigger generation (for testing)
   */
  async triggerManual() {
    console.log('🎯 Manual trigger requested');
    await this.executeScheduledGeneration();
  }

  /**
   * Get next scheduled run time (in CST)
   */
  getNextRun() {
    if (!this.currentTask || !this.currentSchedule) {
      return 'Not scheduled';
    }
    
    // Parse cron expression to estimate next run
    // This is a simple approximation
    const parts = this.currentSchedule.split(' ');
    const [minutes, hours, dayOfMonth, month, dayOfWeek] = parts;
    
    // Get current time in CST
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    const next = new Date(now);
    
    // Set time
    if (hours !== '*') next.setHours(parseInt(hours));
    if (minutes !== '*') next.setMinutes(parseInt(minutes));
    next.setSeconds(0);
    
    // If time has passed today, move to next scheduled day
    if (next <= now) {
      // For daily
      if (dayOfWeek === '*' && dayOfMonth === '*') {
        next.setDate(next.getDate() + 1);
      }
      // For weekly/biweekly
      else if (dayOfWeek !== '*') {
        const targetDay = parseInt(dayOfWeek);
        const currentDay = next.getDay();
        let daysToAdd = targetDay - currentDay;
        if (daysToAdd <= 0) daysToAdd += 7;
        next.setDate(next.getDate() + daysToAdd);
      }
      // For monthly
      else if (dayOfMonth !== '*') {
        next.setMonth(next.getMonth() + 1);
        next.setDate(parseInt(dayOfMonth));
      }
    }
    
    return next.toLocaleString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Chicago',
      timeZoneName: 'short'
    });
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    const settings = this.loadSettings();
    
    return {
      initialized: this.isInitialized,
      active: this.currentTask !== null,
      schedule: this.currentSchedule,
      nextRun: this.getNextRun()
    };
  }

  /**
   * Reload settings from database and update scheduler
   */
  async reloadSettings() {
    console.log('🔄 Reloading scheduler settings...');
    
    const settings = await this.loadSettings();
    
    if (!settings) {
      this.stop();
      console.log('⚠️  No settings found. Scheduler stopped.');
      return;
    }
    
    if (!settings.auto) {
      this.stop();
      console.log('⏸️  Automatic generation disabled. Scheduler stopped.');
      return;
    }
    
    if (!settings.topics || settings.topics.length === 0) {
      this.stop();
      console.log('⚠️  No topics configured. Scheduler stopped.');
      return;
    }
    
    // Update schedule
    await this.updateSchedule(settings.schedule, settings.topics);
  }
}

export default ArticleScheduler;

