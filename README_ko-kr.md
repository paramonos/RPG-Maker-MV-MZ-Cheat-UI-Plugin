+ [RPG-Maker-MV-MZ-Cheat-UI-Plugin](#rpg-maker-mv-mz-cheat-ui-plugin)
+ [소개](#소개)
  - [UI 샘플](#ui-샘플)
  - [기능](#기능)
+ [세팅](#세팅)
  - [적용 방법](#적용-방법)
  - [변수, 스위치 맵 번역 기능 사용을 위한 설정](#변수,-스위치-맵-번역-기능-사용을-위한-설정)
  - [사용 방법](#사용-방법)
  - [치트 설정을 다른 게임에도 적용하고 싶은 경우](#치트-설정을-다른-게임에도-적용하고-싶은-경우)
+ [오류 관련 대처](#오류-관련-대처)
  - [게임의 nwjs 버전이 0.26.4 보다 낮은 경우 (=옛날 버전의 MV 게임인 경우)](#게임의-nwjs-버전이-0264-보다-낮은-경우-(=옛날-버전의-mv-게임인-경우))
  - [치트 버전 업데이트 후 오류가 발생하는 경우](#치트-버전-업데이트-후-오류가-발생하는-경우)
  - [번역이 잘 안 되는 경우](#번역이-잘-안-되는-경우)



# RPG-Maker-MV-MZ-Cheat-UI-Plugin

- GUI 기반 쯔꾸르 MV/MZ 게임 치트 툴

# 소개


## UI 샘플
<p float="left">
  <img src="https://user-images.githubusercontent.com/99193603/153754676-cee2b96e-c03a-491f-b71c-3c57d6dcc474.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754683-4e7a09a5-2d31-436d-8546-7a5d658eb282.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754687-732648c8-3483-42bb-9634-dd22d674dfed.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754692-38e04218-7726-4827-a45b-95485de51a3c.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754696-0cbc76f9-99fa-47a7-a0d0-6510a2f76e01.JPG" width="500"/>
</p>


## 기능
- GUI 기반 편한 사용성.
- 쯔꾸르 MV/MZ 게임 동시 지원.
- 스탯, 돈, 스피드, 아이템, 변수, 스위치 등 편집 기능.
- 게임 가속 (x0.1 ~ x10)
- 벽뚫, 캐릭터 무적 지원.
- 배틀 랜덤 인카운트 비활성화 (맵에서 돌아다닐 때 전투 일어나지 않게 하기).
- 강제로 전투 승리/패배/도망/취소.
- 여러 단축키 지원 (변경 가능).
    - 세이브/로드 창 호출, 퀵 세이브/로드, 타이틀로, 벽뚫 ON/OFF, 아군/적 피 1/회복 등등
- 아이템, 스위치, 변수 등에 대해 검색 기능.
- 위치 저장&이동, 특정 맵 순간이동 기능.
- 개발자 툴 지원 (f12)
- 변수, 스위치, 맵 번역 기능 지원 (관련 로컬 번역 서버가 실행중이어야 합니다).



# 세팅


## 적용 방법
1. 게임이 exe 파일만 있다면 언팩 툴로 언팩.
2. **[releases](https://github.com/paramonos/RPG-Maker-MV-Cheat-UI-Plugin/releases)** 에서 최신 버전의 치트(`rpg-{mv|mz}-cheat-{버전}.zip`) 다운로드 후 압축 해제.
3. 압축을 푼 폴더의 `js`, `cheat` 폴더를 `{게임폴더}/www` 에 덮어쓰기 (RPG MZ 게임에서는, `{게임폴더}` 에 덮어쓰기).
    - `www/js/main.js` 파일을 덮어씌우기 때문에 해당 파일은 백업해두기를 권장합니다.
    - RPG MV 적용 예
      <br/><img src="https://user-images.githubusercontent.com/99193603/153755213-b07f1abb-9c99-4157-857c-2f3a81e4a82a.JPG" width="500"/>
      <br/><img src="https://user-images.githubusercontent.com/99193603/155840463-ae64385f-60c1-478c-b266-8e9580a878e6.png" width="500"/>
    - RPG MZ 적용 예
      <br/><img src="https://user-images.githubusercontent.com/99193603/155840462-028771ef-580c-4b45-969a-85f26329fef0.png" width="500"/>



## 사용 방법

- 기본 설정으로 `Ctrl + C` 입력 시 치트 창이 나타납니다.
    - "Shortcuts" 탭에서 해당 키 설정을 바꿀 수 있습니다.
    - 치트 창에 마우스를 올리지 않은 경우 좀 투명하기 때문에 잘 안 보일 수 있습니다. (게임 창의 우측 상단에 나타납니다)
    - <img src="https://user-images.githubusercontent.com/99193603/153754676-cee2b96e-c03a-491f-b71c-3c57d6dcc474.JPG" width="400"/>



## 변수, 스위치 맵 번역 기능 사용을 위한 설정

- 로컬에서 번역 서버가 실행중이어야 합니다.
- 제대로 번역 서버가 실행이 된 경우 치트 툴 "Translate" 탭에서 초록색 글자로 확인 가능합니다.
  <img src="https://user-images.githubusercontent.com/99193603/172051828-679dec01-2352-4ea5-ba3f-a4ead6f34cae.png" width="500"/>



## 치트 설정을 다른 게임에도 적용하고 싶은 경우

단축키, 이동 속도, 게임 속도, 번역 관련 설정 등을 다른 게임에도 동일하게 적용하고 싶은 경우,

이미 설정이 적용된 게임의 `www/cheat-settings` 폴더를 다른 게임 폴더에 복사하면 됩니다.



# 오류 관련 대처

## 게임의 nwjs 버전이 0.26.4 보다 낮은 경우 (=옛날 버전의 MV 게임인 경우)

- 치트 스크립트가 es6 문법으로 작성되었기 때문에 낮은 버전의 MV 게임들은 치트가 적용이 안 될 수 있습니다.
- 이런 경우, 직접 게임의 nwjs 버전을 올리면 치트 사용 가능합니다.

1. [nwjs](https://dl.nwjs.io/v0.61.0/) 최신 버전을 다운로드 하고 압축 풀기. (파일: `{버전}/nwjs-symbol-v{버전}-win-{ia32|x64}.7z`)
   - 개발자 툴을 사용해야하는 경우 sdk 버전으로 다운로드.
2. 원본 게임 폴더의 `www` 폴더와 `package.json` 파일을 압축을 푼 nwjs 폴더로 이동.
   - <img src="https://user-images.githubusercontent.com/99193603/153755660-25da5b48-b542-443e-bd38-2e3e95e13a63.JPG" width="500"/>
3. `nw.exe` 실행.



> nwjs 업데이트 이후 게임이 정상적으로 동작하지 않는 경우 치트 적용이 불가능한 게임입니다.
>
> - 이런 경우 [다른 치트](https://github.com/emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin)를 사용해주세요.



## 치트 버전 업데이트 후 오류가 발생하는 경우

이전 버전의 치트에서 생성된 설정 파일이 문제일 수 있습니다.

게임 폴더에서 `www/cheat-settings` 폴더를 삭제 후 재실행시켜보세요.



## 번역이 잘 안 되는 경우

대량의 스위치, 맵 등의 텍스트를 번역할 때 속도 향상을 위해 여러 텍스트를 묶어서 한 번에 번역하는 방법을 사용하고 있습니다.

동시에 번역할 텍스트가 너무 많은 경우 번역이 안 되거나, 번역 서버가 강제종료 될 수 있습니다.

이런 경우 Translate - Bulk translate 쪽에서 동시에 번역하는 문장 수를 줄여보세요.


<img src="https://user-images.githubusercontent.com/99193603/172104076-6345c991-9844-4b97-bf65-3aa613f715e4.png" width="500"/>



## MZ 에 치트 적용이 잘 안 될 경우

`js/main.js` 이외의 모든 파일을 게임 폴더에 복사한 후, `js/main.js` 파일에 `"cheat/init/import.js",` 한 줄 추가

```js
//=============================================================================
// main.js v1.3.0
//=============================================================================

const scriptUrls = [
    "cheat/init/import.js", // 가장 위에 한 줄 추가
    // ... 나머지는 그대로 유지
]
```
