// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HealthChain Smart Contract
 * @dev Manages medical record registration and access control on Base L2
 */
contract HealthChain {
    struct MedicalRecord {
        uint256 id;
        address patient;
        string ipfsHash;
        string recordType;
        uint256 timestamp;
        bool isActive;
    }

    struct AccessGrant {
        uint256 recordId;
        address grantee;
        uint256 expiresAt;
        bool isActive;
    }

    uint256 public recordCount;
    mapping(uint256 => MedicalRecord) public records;
    mapping(uint256 => mapping(address => AccessGrant)) public accessGrants;
    mapping(address => uint256[]) public patientRecords;

    event RecordCreated(
        uint256 indexed recordId,
        address indexed patient,
        string ipfsHash,
        string recordType,
        uint256 timestamp
    );

    event AccessGranted(
        uint256 indexed recordId,
        address indexed patient,
        address indexed grantee,
        uint256 expiresAt
    );

    event AccessRevoked(
        uint256 indexed recordId,
        address indexed patient,
        address indexed grantee
    );

    modifier onlyPatient(uint256 _recordId) {
        require(msg.sender == records[_recordId].patient, "Not authorized");
        _;
    }

    /**
     * @dev Create a new medical record
     * @param _ipfsHash IPFS hash of the encrypted record
     * @param _recordType Type of record (consultation, lab_result, etc.)
     * @param _timestamp Record creation timestamp
     * @return recordId The ID of the newly created record
     */
    function createRecord(
        string memory _ipfsHash,
        string memory _recordType,
        uint256 _timestamp
    ) public returns (uint256) {
        recordCount++;
        uint256 newRecordId = recordCount;

        records[newRecordId] = MedicalRecord({
            id: newRecordId,
            patient: msg.sender,
            ipfsHash: _ipfsHash,
            recordType: _recordType,
            timestamp: _timestamp,
            isActive: true
        });

        patientRecords[msg.sender].push(newRecordId);

        // Auto-grant access to the patient
        accessGrants[newRecordId][msg.sender] = AccessGrant({
            recordId: newRecordId,
            grantee: msg.sender,
            expiresAt: block.timestamp + 365 days,
            isActive: true
        });

        emit RecordCreated(newRecordId, msg.sender, _ipfsHash, _recordType, _timestamp);

        return newRecordId;
    }

    /**
     * @dev Grant access to a provider for a specific record
     * @param _recordId The record ID
     * @param _grantee The provider's address
     * @param _expiresAt Expiration timestamp
     */
    function grantAccess(
        uint256 _recordId,
        address _grantee,
        uint256 _expiresAt
    ) public onlyPatient(_recordId) {
        require(records[_recordId].isActive, "Record not active");
        require(_expiresAt > block.timestamp, "Invalid expiration");

        accessGrants[_recordId][_grantee] = AccessGrant({
            recordId: _recordId,
            grantee: _grantee,
            expiresAt: _expiresAt,
            isActive: true
        });

        emit AccessGranted(_recordId, msg.sender, _grantee, _expiresAt);
    }

    /**
     * @dev Revoke access for a provider
     * @param _recordId The record ID
     * @param _grantee The provider's address
     */
    function revokeAccess(
        uint256 _recordId,
        address _grantee
    ) public onlyPatient(_recordId) {
        require(accessGrants[_recordId][_grantee].isActive, "No active grant");

        accessGrants[_recordId][_grantee].isActive = false;
        accessGrants[_recordId][_grantee].expiresAt = block.timestamp;

        emit AccessRevoked(_recordId, msg.sender, _grantee);
    }

    /**
     * @dev Check if a user has access to a record
     * @param _recordId The record ID
     * @param _user The user's address
     * @return bool True if user has active access
     */
    function hasAccess(
        uint256 _recordId,
        address _user
    ) public view returns (bool) {
        AccessGrant memory grant = accessGrants[_recordId][_user];
        return grant.isActive && grant.expiresAt > block.timestamp;
    }

    /**
     * @dev Get record details
     * @param _recordId The record ID
     */
    function getRecord(uint256 _recordId) public view returns (
        uint256 id,
        address patient,
        string memory ipfsHash,
        string memory recordType,
        uint256 timestamp,
        bool isActive
    ) {
        MedicalRecord memory record = records[_recordId];
        return (
            record.id,
            record.patient,
            record.ipfsHash,
            record.recordType,
            record.timestamp,
            record.isActive
        );
    }

    /**
     * @dev Get all record IDs for a patient
     * @param _patient The patient's address
     */
    function getPatientRecords(address _patient) public view returns (uint256[] memory) {
        return patientRecords[_patient];
    }

    /**
     * @dev Deactivate a record (patient only)
     * @param _recordId The record ID
     */
    function deactivateRecord(uint256 _recordId) public onlyPatient(_recordId) {
        records[_recordId].isActive = false;
    }
}
