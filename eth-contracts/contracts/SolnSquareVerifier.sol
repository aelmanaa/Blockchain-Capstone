// "SPDX-License-Identifier: MIYA"
pragma solidity ^0.8.0;

import "./Verifier.sol";
import "./ERC721Mintable.sol";

contract SolnSquareVerifier is MiyaERC721Token {
    struct Solution {
        uint256 tokenId;
        bytes32 index;
        address prover;
        bool isVerified;
    }

    mapping(bytes32 => Solution) private uniqueSolutionsByIndex;
    mapping(uint256 => Solution) private uniqueSolutionsByToken;

    Verifier private verifier;

    event NEW_SOLUTION(
        uint256 indexed _tokenId,
        bytes32 indexed _index,
        address indexed _prover
    );

    constructor(address _verifier) MiyaERC721Token() {
        verifier = Verifier(_verifier);
    }

    function addSolution(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256 tokenId
    ) public whenNotPaused {
        uint256[2] memory input;
        input[0] = tokenId;
        input[1] = 1;
        bytes32 index = keccak256(abi.encodePacked(a, b, c, input));
        require(
            !uniqueSolutionsByIndex[index].isVerified,
            "Solution was already provided"
        );
        require(
            !uniqueSolutionsByToken[tokenId].isVerified,
            "This token was already verified"
        );

        require(
            verifier.verifyTx(a, b, c, input),
            "Provided proof is wrong"
        );

        Solution memory solution;
        solution.tokenId = tokenId;
        solution.index = index;
        solution.prover = msg.sender;
        solution.isVerified = true;
        uniqueSolutionsByIndex[index] = solution;
        uniqueSolutionsByToken[tokenId] = solution;
        emit NEW_SOLUTION(tokenId, solution.index, solution.prover);
    }

    function mint(address to, uint256 tokenId) public override returns (bool) {
        require(
            uniqueSolutionsByToken[tokenId].isVerified,
            "Token ownership was not verified"
        );
        require(
            uniqueSolutionsByToken[tokenId].prover == to,
            "Token owner is wrong"
        );
        return super.mint(to, tokenId);
    }
}
