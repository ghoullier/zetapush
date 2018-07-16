// Packages
const chalk = require('chalk');
const prompt = require('prompt-sync')();
const process = require('process');
const { log, error, warn } = require('./log');

const getDeveloperLogin = () => {
  try {
    return prompt({
      ask: chalk`[{green.bold SECURITY}] {bold Developer login ?}:`,
    });
  } catch (e) {
    if (!process.stdout.isTTY) {
      error(
        "Process is not run in a terminal (no TTY available). Can't prompt for developer login",
        e,
      );
      return '';
    }
    throw e;
  }
};

const getDeveloperPassword = () => {
  try {
    return prompt({
      ask: chalk`[{green.bold SECURITY}] {bold Developer password ?}:`,
      echo: '*',
    });
  } catch (e) {
    if (!process.stdout.isTTY) {
      error(
        "Process is not run in a terminal (no TTY available). Can't prompt for developer password",
        e,
      );
      return '';
    }
    throw e;
  }
};

module.exports = { getDeveloperLogin, getDeveloperPassword };
