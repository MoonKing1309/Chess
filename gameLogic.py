board = [
    ["","","","",""],
    ["","","","",""],
    ["","","","",""],
    ["","","","",""],
    ["","","","",""]
]

choice = ['h1','h2','pawn']

class character(object):
    def __init__(self,side,position,kind):
        self.side = side
        self.position = position
        self.kind = kind

class pawn(object):
    def __init__(self,position,side):
        self.position = position
        self.side = side
    def move(self,direction):
        if direction == "L":
            if self.position[1] ==0:
                return -1
            else:
                self.position[1]-=1
                return 1
        elif direction == "R":
            if self.position[1] ==4:
                return -1
            else:
                self.position[1]+=1
                return 1
        elif direction == "F":
            if self.position[0] ==0:
                return -1
            else:
                self.position[0]-=1
                return 1
        elif direction == "B":
            if self.position[0] ==4:
                return -1
            else:
                self.position[0]+=1
                return 1
class Hero1(object):
    def __init__(self,position,side):
        self.position = position
        self.side = side
    def move(self,direction):
        if direction == "L":
            if self.position[1] <=1:
                return -1
            else:
                self.position[1]-=2
                return 1
        elif direction == "R":
            if self.position[1] >=3:
                return -1
            else:
                self.position[1]+=2
                return 1
        elif direction == "F":
            if self.position[0] <=1:
                return -1
            else:
                self.position[0]-=2
                return 1
        elif direction == "B":
            if self.position[0] >=3:
                return -1
            else:
                self.position[0]+=2
                return 1

class Hero2(object):
    def __init__(self,position,side):
        self.position = position
        self.side = side
    def move(self,direction):
        if direction == "L":
            if self.position[1] <=1:
                return -1
            else:
                self.position[1]-=2
                return 1
        elif direction == "R":
            if self.position[1] >=3:
                return -1
            else:
                self.position[1]+=2
                return 1
        elif direction == "F":
            if self.position[0] <=1:
                return -1
            else:
                self.position[0]-=2
                return 1
        elif direction == "B":
            if self.position[0] >=3:
                return -1
            else:
                self.position[0]+=2
                return 1
            



