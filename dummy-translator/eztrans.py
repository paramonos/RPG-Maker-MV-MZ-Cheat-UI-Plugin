# -*- coding: utf-8 -*-
from flask import Flask, request
import re
import random
import time

app = Flask(__name__)

def decode_text(txt):
    chars = "↔◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞↕↗↙↖↘♩♬㉿㈜㏇™㏂㏘＂＇∼ˇ˘˝¡˚˙˛¿ː∏￦℉€㎕㎖㎗ℓ㎘㎣㎤㎥㎦㎙㎚㎛㎟㎠㎢㏊㎍㏏㎈㎉㏈㎧㎨㎰㎱㎲㎳㎴㎵㎶㎷㎸㎀㎁㎂㎃㎄㎺㎻㎼㎽㎾㎿㎐㎑㎒㎓㎔Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆┒┑┚┙┖┕┎┍┞┟┡┢┦┧┪┭┮┵┶┹┺┽┾╀╁╃╄╅╆╇╈╉╊┱┲ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹ½⅓⅔¼¾⅛⅜⅝⅞ⁿ₁₂₃₄ŊđĦĲĿŁŒŦħıĳĸŀłœŧŋŉ㉠㉡㉢㉣㉤㉥㉦㉧㉨㉩㉪㉫㉬㉭㉮㉯㉰㉱㉲㉳㉴㉵㉶㉷㉸㉹㉺㉻㈀㈁㈂㈃㈄㈅㈆㈇㈈㈉㈊㈋㈌㈍㈎㈏㈐㈑㈒㈓㈔㈕㈖㈗㈘㈙㈚㈛ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁⒂"
    for c in chars:
        if c in txt:
            txt = txt.replace(c,"\\u" + str(hex(ord(c)))[2:])
    return txt

def encode_text(txt):
    return re.sub(r'(?i)(?<!\\)(?:\\\\)*\\u([0-9a-f]{4})', lambda m: chr(int(m.group(1), 16)), txt)

def main():
    app.run()

@app.route("/")
def home():
    return "ezTranslator J2K Web Wrapper"

@app.route("/translate")
def webtranslate():
    wait = random.random() * 3
    time.sleep(wait)
    src_text = request.args.get('text')
    return encode_text('T: ' + decode_text(src_text))

if __name__ == '__main__':
    main()