import { useCallback, useMemo } from "react";

export const useAutoComplete = (arr1, arr2) => {
  // 특수문자 처리 -> 특수문자 앞에 이스케이프를 붙여서 특수문자 그대로를 검색할 수 있게함
  const escapeRegExp = useCallback(
    (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    []
  );

  const totalTitleArr = useMemo(() => {
    const newArr = [...arr1, ...arr2];
    newArr.sort();
    return newArr;
  }, [arr1, arr2]);

  // 문자열 처리
  const ch2pattern = useCallback(
    (ch) => {
      // 사용자가 초성만 입력한 경우, 예를 들어 ㄱ은 ㄱ과 "가"부터 "깋"까지 유니코드화한 범위로 매핑할 것임
      if (/[ㄱ-ㅎ]/.test(ch)) {
        const chToBegin = {
          // charCodeAt은 유니코드를 가져오는 메서드
          ㄱ: "가".charCodeAt(0),
          ㄲ: "까".charCodeAt(0),
          ㄴ: "나".charCodeAt(0),
          ㄷ: "다".charCodeAt(0),
          ㄸ: "따".charCodeAt(0),
          ㄹ: "라".charCodeAt(0),
          ㅁ: "마".charCodeAt(0),
          ㅂ: "바".charCodeAt(0),
          ㅃ: "빠".charCodeAt(0),
          ㅅ: "사".charCodeAt(0),
          ㅆ: "싸".charCodeAt(0),
          ㅇ: "아".charCodeAt(0),
          ㅈ: "자".charCodeAt(0),
          ㅊ: "차".charCodeAt(0),
          ㅋ: "카".charCodeAt(0),
          ㅌ: "타".charCodeAt(0),
          ㅍ: "파".charCodeAt(0),
          ㅎ: "하".charCodeAt(0),
        };
        const begin = chToBegin[ch];
        const end = begin + 587; // "가"부터 "깋"까지는 총 588개
        // 초성 그 자체와 초성으로 시작되는 모든 음절을 포함함
        return `[${ch}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
      }
      // 하나의 온전한 음절을 검색할 때
      else if (/[가-히]/.test(ch)) {
        // 한글의 온전한 음절 중 첫 시작은 "가"이다.
        const offset = "가".charCodeAt(0);
        const chCode = ch.charCodeAt(0) - offset; // "가" 기준, 입력한 몇번째 유니코드인지 확인하기
        // 만약 28로 나눠진다면 초성+중성만 입력한 것이다.
        if (chCode % 28 <= 0) {
          const begin = Math.floor(chCode / 28) * 28 + offset;
          const end = begin + 27; // 초성+중성으로 된 입력값은 받침이 없고 상대적으로 0, 받침 가짓수는 27개니까 + 27
          return `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
        }
        // 초성 중성 종성이 다같이 있다면 그냥 리턴
        else return ch;
      }
      // 한글이 입력되지 않은 경우 -> 영어도 있지만? 영어는 한글처럼 복잡하지 않기에 고려하지 않음
      else return escapeRegExp(ch);
    },
    [escapeRegExp]
  );

  // 문자열 매핑하기
  const createFuzzyMatcher = useCallback(
    (input) => {
      // 연속된 문자열을 split를 통해 하나의 음절마다 map의 콜백함수를 통해 필요하다면 유니코드화를 진행하고 .*?로 다시 문자열로 합침
      const pattern = input.split("").map(ch2pattern).join(".*?"); // .*?는 전자와 후자가 들어있는 모든 단어 검색
      return new RegExp(pattern); // 퍼지한 것을 정규식화함
    },
    [ch2pattern]
  );

  return [totalTitleArr, createFuzzyMatcher];
};
