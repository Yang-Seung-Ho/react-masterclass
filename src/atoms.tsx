import { atom, selector, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
export enum Categories {
  "TO_DO" = "TO_DO",
  "DOING" = "DOING",
  "DONE" = "DONE",
}
export interface IToDo {
  text: string;
  id: number;
  category: string;
}

export const toDoState = atom<IToDo[]>({
  key: "toDo",
  default: [],
});
export const toDoSelector = selector({
  key: "toDoSelector",
  get: ({ get }) => {
    const toDos = get(toDoState);
    const category = get(categoryState);
    return toDos.filter((toDo) => toDo.category === category);
  },
});

export const categoryState = atom<Categories>({
  key: "category",
  default: Categories.TO_DO,
});
// export interface INCat {
//   key: string;
// }
// export const new_categoryState = atom<INCat[]>({
//   key: "category",
//   default: [],
// });
// export const { persistAtom } = recoilPersist();
// export const counterState() = atom({
//   key: "",
//   default: [],
//   effects_UNSTABLE: [persistAtom],
// });
export interface ICategory {
  key: string;
  value: string[];
}
export const CateState = atom<ICategory[]>({
  key: "toDo",
  default: [],
});

export const NtoDoState = atom<IToDo[]>({
  key: "toDo",
  default: [],
});
export interface ICSS {
  option: string;
}
export const CategorySelectState = atom<ICSS[]>({
  key: "CategorySelectState",
  default: [],
});
