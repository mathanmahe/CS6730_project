import cv2, os

for i in sorted(os.listdir('.')):

    if i[-3:] == 'jpg':
        if int(i.split('_')[0]) < 126:
            continue

        image = cv2.imread(i)
        print(i)
        cv2.imshow(i, image)
        cv2.waitKey(-1)
