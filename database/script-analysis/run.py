import subprocess

scripts = ["get_scripts.py", "get_metadata.py", "clean_files.py", "parse_files.py"]

for script in scripts:
    subprocess.run(["python", script])

print("Done")