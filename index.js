import inquirer from "inquirer";
import db from "./prisma/connection.js";
import { hashPassword, comparePassword } from "./utils/hashPassword.js";

console.clear();
console.log(`
===============================
-------C L I - A P P 2---------
===============================
`);

// opsi mau login atau register
inquirer
  .prompt([
    {
      name: "option",
      message: "Please choose : ",
      type: "list",
      choices: ["Login", "Register", "Exit"],
    },
  ])
  .then((ans) => {
    // console.log(ans.option);

    // destruct option object dari ans
    const { option } = ans;

    // Pengkondisian
    if (option === "Login") {
      return login();
    }

    if (option === "Register") {
      return register();
    }

    exit();
  })
  .catch((err) => {
    console.error(err);
  });

// function login
function login() {
  console.clear();

  inquirer
    .prompt([
      {
        name: "username",
        message: "Input username",
      },
      {
        name: "password",
        message: "Input password",
        type: "password",
      },
    ])
    .then(async (ans) => {
      const { username, password } = ans;

      // mencari username sesuai input user
      const getUserData = await db.users.findUnique({
        where: {
          username: username,
        },
      });

      // jika username tidak ditemukan
      if (!getUserData) {
        return console.log("Username cannot found");
      }

      // compare passwordnya
      const tryComparePassword = await comparePassword(
        password,
        getUserData.password
      );

      // jika password tidak sesuai
      if (!tryComparePassword) {
        return console.log("Wrong password");
      }

      // semua sesuai
      console.log(`
  ===============================
  WELCOME ${getUserData.username}
  ===============================
      `);
    });
}

// function register
function register() {
  console.clear();

  inquirer
    .prompt([
      {
        name: "username",
        message: "input username",
      },
      {
        name: "password",
        message: "input password",
        type: "password",
      },
    ])
    .then((ans) => {
      const { username, password } = ans;

      // masukkan data ke database
      db.users
        .create({
          data: {
            username: username,
            password: hashPassword(password),
          },
        })
        .then((res) => {
          console.log("Data has been saved successfully...");
        })
        .catch((err) => {
          console.error(err.message);
        });
    });
}

function exit() {
  console.clear();
  console.log("Thanks...");
}
