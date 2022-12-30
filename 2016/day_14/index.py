import re
import hashlib
import functools

regex = re.compile(r'([abcdef0-9])\1{2}')

@functools.lru_cache(maxsize=None)
def getmd5(s):
    return hashlib.md5(s.encode('utf-8')).hexdigest()

@functools.lru_cache(maxsize=None)
def getlongmd5(s):
    for _ in range(2017):
        s = hashlib.md5(s.encode('utf-8')).hexdigest()
    print(s);
    return s

def do_it(salt, long=False):
    fn = getlongmd5 if long else getmd5
    i = 0
    j = 0
    while True:
        g = re.search(regex, fn(salt.format(i)))
        if g:
            check = g.group()[0] * 5
            if any(check in fn(salt.format(j)) for j in range(i+1, i+1001)):
                j +=1
                if j==64:
                    return i
        i += 1


print(do_it("ngcjuoqr{}"))
print(do_it("ngcjuoqr{}", long = True))
