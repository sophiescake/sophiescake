import sys
import os


# no starting number, spaces or other character other than normal characters
def polishLine(line):
    newLine = "";
    firstNormalCharFound = False
    for c in line:
        if not firstNormalCharFound:
            if (c != ' ' and ((c > 'a' and c < 'z') or (c > 'A' and c < 'Z'))):
                newLine += c
                firstNormalCharFound = True
        else:
            newLine += c

    return newLine

if __name__ == "__main__":
    fileNameToRead = sys.argv[1]

    # Write polished lines to new file
    newFile = open(os.path.splitext(fileNameToRead)[0] + '_polished.txt', 'w')
    
    # Read file to be polished
    readFile = open(fileNameToRead, 'r')
    lines = readFile.readlines()

    # Go line by line, polish and save
    for line in lines:
        newLine = polishLine(line)

        newFile.write(newLine)
        # newFile.write('\n')

    newFile.close()