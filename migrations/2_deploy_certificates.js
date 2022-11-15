const CertificatesContract = artifacts.require("CertificatesContract.sol");

module.exports = function (deployer) {
  deployer.deploy(CertificatesContract);
};
