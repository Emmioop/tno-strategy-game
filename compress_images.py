#!/usr/bin/env python3
"""Compress event images to 25-80KB range."""
import os
import sys
from PIL import Image
from pathlib import Path

EVENTS_DIR = Path("/workspace/tno-strategy-game/img/events")
TARGET_MIN = 25 * 1024  # 25KB
TARGET_MAX = 80 * 1024  # 80KB
TARGET_WIDTH = 1280


def compress_image(filepath: Path) -> tuple:
    """Compress a single image. Returns (name, original_size, new_size)."""
    original_size = filepath.stat().st_size

    if original_size <= TARGET_MAX:
        return (filepath.name, original_size, original_size)

    img = Image.open(filepath)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    # Resize if wider than target
    w, h = img.size
    if w > TARGET_WIDTH:
        ratio = TARGET_WIDTH / w
        new_h = int(h * ratio)
        img = img.resize((TARGET_WIDTH, new_h), Image.LANCZOS)

    # Try quality from 85 down to 30
    for quality in range(85, 29, -5):
        import io
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=quality, optimize=True)
        size = buf.tell()
        if size <= TARGET_MAX:
            buf.seek(0)
            with open(filepath, "wb") as f:
                f.write(buf.read())
            return (filepath.name, original_size, size)

    # If still too large at q=30, try reducing dimensions
    for scale in [0.9, 0.8, 0.7]:
        new_w = int(TARGET_WIDTH * scale)
        new_h = int(img.height * scale)
        resized = img.resize((new_w, new_h), Image.LANCZOS)
        buf = io.BytesIO()
        resized.save(buf, format="JPEG", quality=85, optimize=True)
        size = buf.tell()
        if size <= TARGET_MAX:
            buf.seek(0)
            with open(filepath, "wb") as f:
                f.write(buf.read())
            return (filepath.name, original_size, size)

    # Fallback
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=30, optimize=True)
    size = buf.tell()
    buf.seek(0)
    with open(filepath, "wb") as f:
        f.write(buf.read())
    return (filepath.name, original_size, size)


def main():
    files = sorted(EVENTS_DIR.glob("*.jpg"))
    print(f"Found {len(files)} images to compress")

    total_before = 0
    total_after = 0
    compressed_count = 0
    skipped = 0

    for f in files:
        result = compress_image(f)
        name, orig, new = result
        total_before += orig
        total_after += new

        if orig <= TARGET_MAX:
            skipped += 1
            continue
        compressed_count += 1
        status = "✓" if new <= TARGET_MAX else "⚠"
        print(f"  {status} {name}: {orig//1024}KB → {new//1024}KB")

    print(f"\nSummary:")
    print(f"  Total images: {len(files)}")
    print(f"  Compressed: {compressed_count}")
    print(f"  Skipped (already small): {skipped}")
    print(f"  Total before: {total_before//1024}KB ({total_before/(1024*1024):.1f}MB)")
    print(f"  Total after:  {total_after//1024}KB ({total_after/(1024*1024):.1f}MB)")
    print(f"  Saved: {(total_before-total_after)//1024}KB ({(total_before-total_after)/(1024*1024):.1f}MB)")


if __name__ == "__main__":
    main()
