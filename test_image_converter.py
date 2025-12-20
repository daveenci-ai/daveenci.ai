#!/usr/bin/env python3
"""
Image Optimization Script
Converts PNG images to optimized JPG format with reduced quality and size.
"""

import os
from pathlib import Path
from PIL import Image
import argparse


def optimize_image(input_path: Path, quality: int = 85, max_width: int = 1920, delete_original: bool = True):
    """
    Convert PNG to optimized JPG in the same directory.
    
    Args:
        input_path: Path to input PNG file
        quality: JPG quality (1-100, default 85)
        max_width: Maximum width in pixels (default 1920)
        delete_original: Delete PNG after successful conversion (default True)
    """
    try:
        # Open image
        img = Image.open(input_path)
        
        # Convert RGBA to RGB (PNG transparency to white background)
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize if image is too large
        original_dimensions = f"{img.width}x{img.height}"
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            print(f"  Resized: {original_dimensions} → {max_width}x{new_height}")
        
        # Create output filename in the same directory
        output_path = input_path.parent / (input_path.stem + '.jpg')
        
        # Save as optimized JPG
        img.save(output_path, 'JPEG', quality=quality, optimize=True)
        
        # Get file sizes
        original_size = input_path.stat().st_size / 1024  # KB
        new_size = output_path.stat().st_size / 1024  # KB
        reduction = ((original_size - new_size) / original_size) * 100
        
        print(f"✓ {input_path.name} → {output_path.name}")
        print(f"  {original_size:.1f} KB → {new_size:.1f} KB (↓ {reduction:.1f}%)")
        
        # Delete original PNG if successful
        if delete_original:
            input_path.unlink()
            print(f"  🗑️  Deleted original PNG")
        
        return True
        
    except Exception as e:
        print(f"✗ Error processing {input_path.name}: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description='Convert PNG images to optimized JPG in the same directory')
    parser.add_argument('input_dir', nargs='?', default='frontend/images',
                        help='Directory containing PNG files (default: frontend/images)')
    parser.add_argument('-q', '--quality', type=int, default=85,
                        help='JPG quality 1-100 (default: 85)')
    parser.add_argument('-w', '--max-width', type=int, default=1920,
                        help='Maximum width in pixels (default: 1920)')
    parser.add_argument('--keep-original', action='store_true',
                        help='Keep original PNG files (default: delete after conversion)')
    
    args = parser.parse_args()
    
    # Convert to Path object
    input_dir = Path(args.input_dir)
    
    # Validate input directory
    if not input_dir.exists():
        print(f"Error: Input directory '{input_dir}' does not exist")
        return
    
    # Find all PNG files
    png_files = list(input_dir.glob('*.png')) + list(input_dir.glob('*.PNG'))
    
    if not png_files:
        print(f"No PNG files found in {input_dir}")
        return
    
    print(f"Found {len(png_files)} PNG file(s) in {input_dir}")
    print(f"Quality: {args.quality}, Max Width: {args.max_width}px")
    print(f"Delete originals: {not args.keep_original}\n")
    
    # Process each file
    success_count = 0
    for png_file in png_files:
        if optimize_image(png_file, args.quality, args.max_width, delete_original=not args.keep_original):
            success_count += 1
        print()
    
    print(f"Completed: {success_count}/{len(png_files)} files optimized successfully")


if __name__ == '__main__':
    main()
