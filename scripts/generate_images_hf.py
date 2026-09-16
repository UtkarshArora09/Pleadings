"""
Pleadings — Free Hugging Face Offline Image Generator
Uses the official 'diffusers' library to generate high-res cinematic 16:9 imagery.

Usage:
  1. pip install -U diffusers transformers accelerate torch
  2. python scripts/generate_images_hf.py --prompt "Dramatic 16:9 cinematic archival billboard for Indian court case, warm amber lighting" --slug "my-case" --type "poster"
"""

import os
import sys
import argparse
import time

try:
    import torch
    from diffusers import DiffusionPipeline
except ImportError:
    print("❌ 'diffusers' or 'torch' not installed. Install with:")
    print("   pip install -U diffusers transformers accelerate torch")
    sys.exit(1)


def generate_image(prompt: str, slug: str = "case", image_type: str = "poster", model_id: str = "black-forest-labs/FLUX.1-schnell"):
    print(f"🎨 Loading model: {model_id}...")
    
    device = "cuda" if torch.cuda.is_available() else ("mps" if torch.backends.mps.is_available() else "cpu")
    torch_dtype = torch.bfloat16 if device != "cpu" else torch.float32

    pipe = DiffusionPipeline.from_pretrained(model_id, torch_dtype=torch_dtype)
    pipe.to(device)

    print(f"⚡ Generating image for prompt: '{prompt[:60]}...' on device '{device}'")
    
    # 16:9 aspect ratio standard: 1024x576 or 1280x720
    image = pipe(prompt, height=576, width=1024).images[0]

    output_dir = os.path.join(os.getcwd(), "public", "images", "cases")
    os.makedirs(output_dir, exist_ok=True)

    file_name = f"{slug}-{image_type}-{int(time.time())}.jpg"
    file_path = os.path.join(output_dir, file_name)
    
    image.save(file_path, quality=95)
    print(f"✅ Image successfully saved to: {file_path}")
    print(f"   Public Web Path: /images/cases/{file_name}")
    return f"/images/cases/{file_name}"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate AI images with Hugging Face Diffusers")
    parser.add_argument("--prompt", type=str, required=True, help="Image prompt")
    parser.add_argument("--slug", type=str, default="case", help="Case slug")
    parser.add_argument("--type", type=str, default="poster", help="Image type: poster, exhibit, or verdict")
    parser.add_argument("--model", type=str, default="black-forest-labs/FLUX.1-schnell", help="Hugging Face Model ID")

    args = parser.parse_args()
    generate_image(args.prompt, args.slug, args.type, args.model)
