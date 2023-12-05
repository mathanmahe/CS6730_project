import json
import cv2
import numpy as np
import glob, os

files =  glob.glob("*.jpg")
files_dict = {u.split('_')[1]: u for u in files}

uu = {}

def bbox_area(top_left, bottom_right):
    width = bottom_right[0] - top_left[0]
    height = bottom_right[1] - top_left[1]
    area = width * height
    return area

with open('126_250.json', 'r') as fp:
    u = json.load(fp)
    for key in u.keys():
        if not u[key]['genders']:
            uu[key] = {
                'posterFProportion': 0,
                'posterMProportion': 0,
            }
        else:
            male_area = 0
            female_area = 0
            image = cv2.imread(files_dict[key])
            for i in range(len(u[key]['genders'])):
                if len(u[key]['points'])%2 == 1:
                    u[key]['points'] = u[key]['points'][1:]
                gender = u[key]['genders'][i]

                bb0, bb1 = u[key]['points'][2*i], u[key]['points'][2*i + 1]
                bbox = bbox_area(bb0, bb1)

                color = (0,0,0)
                if gender == 'M':
                    color = (193,167,39)
                    male_area += bbox
                else:
                    color = (109,94,227)
                    female_area += bbox

                cv2.rectangle(image, tuple(bb0), tuple(bb1), color, 10)  # (0, 255, 0) is the color in BGR format, and 2 is the thickness
            output_path = 'annotated/{}.jpg'.format(key.split('.')[0])
            cv2.imwrite(output_path, image)

            total = male_area + female_area

            uu[key.split('.')[0]] = {
                'posterFProportion': round(female_area/total, 3),
                'posterMProportion': round(male_area/total, 3),
            }

with open('126_250_f.json', 'w+') as fpp:
    fpp.write(json.dumps(uu, indent=2))

