import { useForm } from "react-hook-form";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import {
  CateState,
  CategorySelectState,
  categoryState,
  toDoState,
} from "./atoms";

interface IForm {
  toDo: string;
  cat: string;
}
function NewToDoList() {
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const setToDos = useSetRecoilState(toDoState);
  const [category, setCategory] = useRecoilState(CateState);
  const CatSelect = useRecoilValue(CategorySelectState).toString();
  const handleValid = ({ toDo }: IForm & { cs: string }) => {
    setCategory((oldToDos) => [{ key: CatSelect, value: [toDo] }, ...oldToDos]);
    setValue("toDo", "");
  };
  console.log(CatSelect.toString(), category);
  return (
    <div>
      <form onSubmit={handleSubmit(handleValid as any)}>
        <input
          {...register("toDo", {
            required: "Please write a To Do",
          })}
          placeholder="Write a to do"
        ></input>

        <button>add</button>
      </form>
      <ul>
        {category.map((category) =>
          category.value.length === 1 && CatSelect === category.key ? (
            <li key={`${category.key}${Date.now()}`}>{category.value}</li>
          ) : null
        )}
      </ul>
    </div>
  );
}
export default NewToDoList;
