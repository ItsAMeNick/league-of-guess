# Nick Zoner 1/7/2021
# The purpose of this file to to generate a datapack from a set of images

import sys
import os
import json

def main():
    if (len(sys.argv) != 2):
        print("Invalid Usage: datapackbuilder.py [folder]")
        exit()
    elif (os.path.isdir(sys.argv[1]) == False):
        print("Invalid Usage: Folder does not exist")
        exit()
    else:
        FOLDER = sys.argv[1]

        # #Doing a manual clean
        # for item in os.listdir(FOLDER):
        #     os.rename('{}/{}'.format(FOLDER, item), '{}/{}'.format(FOLDER, item.replace("_", "").replace("%27", "").replace("%26", "")))

        datapack = {}
        counter = 0
        for item in os.listdir(FOLDER):
            if (item.split('.')[-1] == "json"):
                continue
            if ((item.split('.')[-1] != "png") and (item.split('.')[-1] != "jpg")):
                print("Unsupported Image: {}".format(item))
                exit()
            datapack[counter] = {
                "id": counter,
                "name": item.split('.')[0].replace("_", " ").replace("%27", "'").replace("%26", "&"),
                "image": '{}/{}'.format(FOLDER, item.replace("_", "").replace("%27", "").replace("%26", ""))
            }
            counter += 1

        datapack_file = open('{}/{}_datapack.json'.format(FOLDER, FOLDER), "w")
        datapack_file.write(json.dumps(datapack))
        datapack_file.close()

if __name__ == '__main__':
    main()
