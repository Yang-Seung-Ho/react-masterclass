import { useForm } from "react-hook-form";
import {
  atom,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import CreateToDo from "./CreateToDo";
import { categoryState, toDoState, toDoSelector, Categories } from "./atoms";
import ToDo from "./ToDo";

export function ToDoList() {
  const [category, setCategory] = useRecoilState(categoryState);
  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    setCategory(event.currentTarget.value as any);
  };
  const toDos = useRecoilValue(toDoSelector);

  return (
    <div>
      <h1>TO DO!!!</h1>
      <hr />
      <hr />
      <select value={category} onInput={onInput}>
        <option value={Categories.TO_DO}>To Do</option>
        <option value={Categories.DOING}>Doing</option>
        <option value={Categories.DONE}>Done</option>
      </select>
      <CreateToDo />
      {toDos?.map((toDo) => (
        <ToDo key={toDo.id} {...toDo} />
      ))}
    </div>
  );
}
