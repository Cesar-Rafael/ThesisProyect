// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract CertificatesContract {
    uint256 public idCertificate = 0;

    struct Certificate {
        uint256 id;
        string idStudent;
        string encryptedCertificate;
        bool valid;
        uint256 createdAt;
    }

    event CertificateRegistered(
        uint256 id,
        string idStudent,
        string encryptedCertificate,
        bool valid,
        uint256 createdAt
    );

    event CertificateCanceled(uint256 id, bool valid);

    mapping(uint256 => Certificate) public certificates;

    function registrateCertificate(
        string memory _idStudent,
        string memory _certificate
    ) public {
        idCertificate++;

        uint256 createdAt = block.timestamp;

        certificates[idCertificate] = Certificate(
            idCertificate,
            _idStudent,
            _certificate,
            true,
            createdAt
        );

        emit CertificateRegistered(
            idCertificate,
            _idStudent,
            _certificate,
            true,
            createdAt
        );
    }

    function cancelCertificate(uint256 _id) public {
        Certificate memory _certificate = certificates[_id];
        _certificate.valid = false;
        certificates[_id] = _certificate;
        emit CertificateCanceled(_id, _certificate.valid);
    }
}