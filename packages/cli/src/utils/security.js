// Packages
const chalk = require('chalk');
const prompts = require('prompts');
const process = require('process');
const { error } = require('@zetapush/common');

const getDeveloperLogin = async () => {
  try {
    const { value } = await prompts({
      name: 'value',
      type: 'text',
      message: chalk`[{green.bold SECURITY}] {bold Developer login ?}:`
    });
    return value;
  } catch (e) {
    if (!process.stdout.isTTY || !process.stdin.setRawMode) {
      error("Process is not run in a terminal (no TTY available). Can't prompt for developer login", e);
      return '';
    }
    throw e;
  }
};

const getDeveloperPassword = async () => {
  try {
    const { value } = await prompts({
      name: 'value',
      type: 'password',
      message: chalk`[{green.bold SECURITY}] {bold Developer password ?}:`
    });
    return value;
  } catch (e) {
    if (!process.stdout.isTTY || !process.stdin.setRawMode) {
      error("Process is not run in a terminal (no TTY available). Can't prompt for developer password", e);
      return '';
    }
    throw e;
  }
};

module.exports = { getDeveloperLogin, getDeveloperPassword };
