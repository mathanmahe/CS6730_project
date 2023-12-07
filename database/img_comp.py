from PIL import Image
import os

def compress_images(directory, new_directory, quality=100, size_reduction_factor=0.2):
    """
    주어진 디렉토리의 모든 이미지를 압축하고 새 디렉토리에 저장합니다.

    Args:
    directory (str): 원본 이미지가 있는 디렉토리 경로.
    new_directory (str): 압축된 이미지를 저장할 새 디렉토리 경로.
    quality (int): 이미지의 품질 (1-100).
    size_reduction_factor (float): 이미지 크기 감소 비율 (0-1).
    """
    # 새 디렉토리가 없다면 생성
    if not os.path.exists(new_directory):
        os.makedirs(new_directory)

    for filename in os.listdir(directory):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            img_path = os.path.join(directory, filename)
            img = Image.open(img_path)

            # 이미지 크기 조정
            img = img.resize((int(img.width * size_reduction_factor), int(img.height * size_reduction_factor)))

            # 압축 및 저장
            new_img_path = os.path.join(new_directory, filename)
            img.save(new_img_path, quality=quality)

# 사용 예시
source_directory = '../posters'
target_directory = 'posters'
compress_images(source_directory, target_directory)
