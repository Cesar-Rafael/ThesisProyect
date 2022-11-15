const CertificatesContract = artifacts.require("CertificatesContract");

contract("CertificatesContract", (accounts) => {
  before(async () => {
    this.CertificatesContract = await CertificatesContract.deployed();
  });

  it("migrate deployed successfully", async () => {
    const address = await this.CertificatesContract.address;

    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  });

  it("get certificates list", async () => {
    const idCertificate = await this.CertificatesContract.idCertificate();
    const certificate = await this.CertificatesContract.certificates(
      idCertificate
    );

    assert.equal(certificate.id.toNumber(), idCertificate.toNumber());
  });

  it("certificate created successfully", async () => {
    const result = await this.CertificatesContract.registrateCertificate(
      "6314077d8c90691cc7961c5d",
      "U2FsdGVkX18zAHtS2bjJpPLtc0sEwpVHzpypMmPiO/Kfcsm5oD/w5KAgqzELrx8z82DNxJsUhhH8I+BgTXlyf90/dysFU1VXdkoa5GsIb0U5A2KDulxSkuw06dxenFQeBpwTvkIimpOkr8nqkS1pBVJWWl8mRq/lp/SjHro+ty8uWQZRsqcDlkIAm9+5HnhSfeYDj4IhWXEaWABxBngbqgf3vLFIyr/oBxYgaXYRWtfkXvsbZf63+QrKlWvLdx5v8oV59Dixz2dxw+QUtMcqertV3cCzmHDRbeYGFeosRBMywRJtGqRmhYiySKqL43tjBpIm/2bSJL1P6aWwzDXPCQ=="
    );
    const certificateEvent = result.logs[0].args;
    const idCertificate = await this.CertificatesContract.idCertificate();

    assert.equal(idCertificate, certificateEvent.id.toNumber());
  });
});
