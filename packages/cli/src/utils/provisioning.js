const { Queue, Weak } = require('@zetapush/platform-legacy');
const { Worker } = require('@zetapush/worker');
const core = require('@zetapush/common');

/**
 * Get deployment id list from injected service to provisioning items
 * @param {Analyzed} declaration
 * @return {string[]}
 */
const getDeploymentIdList = (declaration) => core.getDeploymentIdList(declaration, [], [Queue]);

/**
 * Get bootstrap provisioning items
 * @param {ZetaPushConfig} config
 * @param {Service[]} services the bootstrap services (mainly Worker and Weak)
 */
const getBootstrapProvision = (config) => core.getBootstrapProvision(config, [Worker, Weak]);

/**
 * Get provisioning from injected service to provisioning items
 * @param {ZetaPushConfig} config
 * @param {Analyzed} declaration
 */
const getRuntimeProvision = (config, declaration) => core.getRuntimeProvision(config, declaration, [], [Queue]);

/**
 * Generate a normalized file used by ZBO to provision ZetaPush Services
 * @param {String} filepath
 * @param {Object} config
 */
const generateProvisioningFile = (filepath, config, artefactConfig) =>
  core.generateProvisioningFile(filepath, config, artefactConfig, Worker);

module.exports = {
  generateProvisioningFile,
  getBootstrapProvision,
  getDeploymentIdList,
  getRuntimeProvision
};
