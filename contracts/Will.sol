// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Will {
    string public generalWill;

    struct Beneficiary {
        address wallet;
        string asset; // e.g. ETH, NFT, Land, etc.
        string message;
    }

    Beneficiary[] public beneficiaries;

    event WillUpdated(string newMessage);
    event BeneficiaryAdded(address wallet, string asset, string message);

    function updateGeneralWill(string calldata _message) public {
        generalWill = _message;
        emit WillUpdated(_message);
    }

    function addBeneficiary(address _wallet, string calldata _asset, string calldata _message) public {
        beneficiaries.push(Beneficiary(_wallet, _asset, _message));
        emit BeneficiaryAdded(_wallet, _asset, _message);
    }

    function getAllBeneficiaries() public view returns (Beneficiary[] memory) {
        return beneficiaries;
    }

    function getBeneficiaryCount() public view returns (uint) {
        return beneficiaries.length;
    }
}
