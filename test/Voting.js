const { expect } = require("chai");

describe("Voting Contract", function () {

    let _voting;
    let voting;
    let rejuveAdmin;
    let user1;
    let user2;
    let addrs;
    let proposalInfo = "";
    let votingResult = "";;
    
    before(async function () {
        [rejuveAdmin, user1, user2, ...addrs] = await ethers.getSigners();
        _voting= await ethers.getContractFactory("Voting");
        voting = await _voting.deploy();
    }); 

    it("Should revert if contract is paused by person other than owner", async function () {
        await expect(voting.connect(user1).pause())
        .to.be.revertedWith("Ownable: caller is not the owner");   
    })

    it("Should revert if contract is paused", async function () {
        await voting.pause();
        await expect(voting.addProposal(100, proposalInfo, votingResult))
        .to.be.revertedWith("Pausable: paused");   
    })

    it("Should revert if contract is unpaused by person other than owner", async function () {
        await expect(voting.connect(user1).unpause())
        .to.be.revertedWith("Ownable: caller is not the owner");   
    })

    it("Should revert if adding proposal is called by someone other than owner", async function () {
        await voting.unpause();
        await expect(voting.connect(user1).addProposal(100, proposalInfo, votingResult))
        .to.be.revertedWith("Ownable: caller is not the owner");   
    })

    it("Should revert if total participants are zero", async function () {
        await expect(voting.addProposal(0, proposalInfo, votingResult))
        .to.be.revertedWith("REJUVE: Total participants cannot be zero");   
    })

    it("Should revert if empty proposal info", async function () {
        await expect(voting.addProposal(10, proposalInfo, votingResult))
        .to.be.revertedWith("REJUVE: Proposal info cannot be empty");   
    })

    it("Should revert if empty voting result", async function () {
        let proposalInfoNew = "This is a proposal";
        await expect(voting.addProposal(10, proposalInfoNew, votingResult))
        .to.be.revertedWith("REJUVE: Voting result info cannot be empty");   
    })

    it("Should add proposal", async function () {
        let proposalInfoNew = "This is another proposal";
        let votingResultNew = "Passed";
        await voting.addProposal(100, proposalInfoNew, votingResultNew);    
        let proposal = await voting.getProposal(1);

        expect(proposal[2]).to.equal(proposalInfoNew);
        expect(proposal[3]).to.equal(votingResultNew);
    });
})