import mergeAccounts,
  {
    isSameAccount,
    createPersonFromAccount,
    createPersonFromAccountAndPerson,
    createAdjacencyList
  } from "../../src/accounts-merger";

describe("AccountsMerger", () => {
  const accounts = [
    {
      application: 1,
      emails: ["a@gmail.com"],
      name: "A"
    },
    {
      application: 1,
      emails: ["b@gmail.com", "c@gmail.com"],
      name: "B"
    },
    {
      application: 3,
      emails: ["d@gmail.com"],
      name: "A"
    },
    {
      application: 4,
      emails: ["a@gmail.com", "d@gmail.com"],
      name: "A"
    },
    {
      application: 3,
      emails: ["e@gmail.com", "f@gmail.com", "g@gmail.com"],
      name: "C"
    },
    {
      application: 5,
      emails: ["e@gmail.com", "g@gmail.com"],
      name: "C"
    }
  ];
  describe("mergeAccounts", () => {
    it("should be able to merge multiple Accounts into People", () => {
      const people = mergeAccounts(accounts);
      expect(people).toEqual([
        {
          applications: ["4", "3", "1"],
          emails: ["a@gmail.com", "d@gmail.com"],
          name: "A"
        },
        {
          applications: ["1"],
          emails: ["b@gmail.com", "c@gmail.com"],
          name: "B"
        },
        {
          applications: ["5", "3"],
          emails: ["e@gmail.com", "g@gmail.com", "f@gmail.com"],
          name: "C"
        }
      ]);
    });
  });

  describe("isSameAccount", () => {
    it("should return true for Accounts with shared emails", () => {
      expect(isSameAccount(accounts[0], accounts[3])).toBe(true);
    });
    it("should return false for Accounts that don't share emails", () => {
      expect(isSameAccount(accounts[1], accounts[2])).toBe(false);
    });
  });

  describe("createPersonFromAccount", () => {
    it("should create a Person from the Account", () => {
      const person = createPersonFromAccount(accounts[0]);
      expect(person).toEqual({
        applications: ["1"],
        emails: ["a@gmail.com"],
        name: "A"
      });
    });
  });

  describe("createPersonFromAccountAndPerson", () => {
    it("should create a merged Person from the Account and Person", () => {
      const person = {
        applications: ["2", "3"],
        emails: ["c@gmail.com", "d@gmail.com"],
        name: "B"
      };
      const newPerson = createPersonFromAccountAndPerson(accounts[1], person);
      expect(newPerson).toEqual({
        applications: ["1", "2", "3"],
        emails: ["b@gmail.com", "c@gmail.com", "d@gmail.com"],
        name: "B"
      });
    });
  });

  describe("createAdjacencyList", () => {
    it("should create an adjacencyList for the supplied Accounts", () => {
      const expectedAdjacencyList = new Map();
      expectedAdjacencyList.set("a@gmail.com", new Set(["d@gmail.com"]));
      expectedAdjacencyList.set("b@gmail.com", new Set(["c@gmail.com"]));
      expectedAdjacencyList.set("c@gmail.com", new Set(["b@gmail.com"]));
      expectedAdjacencyList.set("d@gmail.com", new Set(["a@gmail.com"]));
      expectedAdjacencyList.set("e@gmail.com", new Set(["f@gmail.com", "g@gmail.com"]));
      expectedAdjacencyList.set("f@gmail.com", new Set(["e@gmail.com", "g@gmail.com"]));
      expectedAdjacencyList.set("g@gmail.com", new Set(["e@gmail.com", "f@gmail.com"]));
      expect(createAdjacencyList(accounts)).toEqual(expectedAdjacencyList);
    });
  });
});