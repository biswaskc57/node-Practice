import React from "react";
const Content = (props) => {
  return (
    <div>
      <Part parts={props.parts} />
    </div>
  );
};
const Header = (props) => {
  return <h1>{props.name}</h1>;
};
const Total = (props) => {
  console.log(props.part);

  var totalAmount = props.part.reduce(function (sum, order) {
    console.log("what is happening", sum, order);
    return sum + order.exercises;
  }, 0);
  console.log(totalAmount);

  return <p>Number of exercises: {totalAmount}</p>;
};
const Part = (props) => {
  console.log(props.parts);
  const parts = props.parts;
  console.log(parts);
  return (
    <div>
      <ul>
        {parts.map((part) => (
          <li key={part.id}>
            {part.name}:{part.exercises}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default function Course(props) {
  const courses = props.courses;
  console.log(courses);
  return (
    <div>
      {courses.map((eachcourse) => (
        <div key={eachcourse.id}>
          <Header name={eachcourse.name} />
          <Content parts={eachcourse.parts} />
          <Total part={eachcourse.parts} />
        </div>
      ))}
    </div>
  );
}
