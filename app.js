const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const students = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/students.json`)
);

const getAllStudents = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: students.length,
    data: {
      students
    },
  });
};

const createStudent = (req, res) => {
  const newId = students[students.length - 1].id + 1;
  const newStudent = Object.assign({ id: newId }, req.body);

  students.push(newStudent);
  console.log(newStudent);

  fs.writeFile(
    `${__dirname}/dev-data/data/students.json`,
    JSON.stringify(students),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          user: newStudent
        },
      });
    }
  );
};

const getStudent = (req, res) => {
  var params = req.params;
  var id = params["id"];

  var user = students.find(u => u._id == id);

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      user
    },
  });
};

const deleteStudent = (req, res) => {
  var params = req.params;
  var id = params["id"];

  var user = students.find(u => u._id == id);

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: {
      message: "Deleted",
    },
  });
};

const updateStudent = (req, res) => {
  var params = req.params;
  var id = params["id"];

  var user = students.find(u => u._id == id);

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      message: "Updated",
    },
  });
};

const userRouter = express.Router();
app.use("/api/v1/students", userRouter);

userRouter
  .route("/")
  .get(getAllStudents)
  .post(createStudent);

userRouter
  .route("/:id")
  .get(getStudent)
  .patch(updateStudent)
  .delete(deleteStudent);

app.listen(27001, () => {
  console.log("App is running on port 27001");
});