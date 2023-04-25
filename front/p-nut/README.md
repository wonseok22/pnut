# React Project 개발 환경

## node와 package manager 설치

### node

```bash
node -v
```

v18.12.1

### yarn

```bash
yarn -v
```

1.22.19

yarn이 없다면 npm install -g yarn@1.22.19

## 의존성 모듈 설치

yarn install

## react 프로젝트를 node환경에서 실행하기

yarn dev

## Tailwindcss

Tailwind 설정을 바꿨다면

npx tailwindcss -i ./src/index.css -o ./src/output.css --watch
