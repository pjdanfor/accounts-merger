interface Account {
  application: number,
  emails: string[],
  name: string
};

interface Person {
  applications: string[],
  emails: string[],
  name: string
};

const isSameAccount = (accountOne: Account, accountTwo: Account): boolean => {
  for (let i = 0; i < accountOne.emails.length; i++) {
    if (accountTwo.emails.includes(accountOne.emails[i])) {
      return true;
    }
  }
  return false;
};

const createPersonFromAccount = (account: Account): Person => {
  return {
    applications: [account.application.toString()],
    emails: account.emails,
    name: account.name
  };
};

const createPersonFromAccountAndPerson = (account: Account, person: Person): Person => {
  return {
    applications: [...(new Set([account.application.toString(), ...person.applications]))],
    emails: [...(new Set([...account.emails, ...person.emails]))],
    name: person.name
  };
};

const createAdjacencyList = (accounts: Account[]): Map<string, Set<string>> => {
  const adjacencyList: Map<string, Set<string>> = new Map();

  // Setup adjacencyList for each email in account in both directions
  for (let i = 0; i < accounts.length; i++) {
    for (let j = 0; j < accounts[i].emails.length; j++) {
      if (!adjacencyList.get(accounts[i].emails[j])) {
        adjacencyList.set(accounts[i].emails[j], new Set());
      }
    }

    for (let k = 0; k < accounts[i].emails.length; k++) {
      for (let l = k + 1; l < accounts[i].emails.length; l++) {
        adjacencyList.get(accounts[i].emails[k]).add(accounts[i].emails[l]);
        adjacencyList.get(accounts[i].emails[l]).add(accounts[i].emails[k]);
      }
    }
  }

  // Check if each of the accounts are the same. Add their emails
  // to each other's list if they are.
  for (let i = 0; i < accounts.length; i++) {
    for (let j = i + 1; j < accounts.length; j++) {
      if (isSameAccount(accounts[i], accounts[j])) {
        accounts[i].emails.forEach(iEmail => {
          accounts[j].emails.forEach(jEmail => {
            if (iEmail !== jEmail) {
              adjacencyList.get(iEmail).add(jEmail);
            }
          });
        });
        accounts[j].emails.forEach(jEmail => {
          accounts[i].emails.forEach(iEmail => {
            if (jEmail !== iEmail) {
              adjacencyList.get(jEmail).add(iEmail);
            }
          });
        });
      }
    }
  }

  return adjacencyList;
};

const mergeAccounts = (accounts: Account[]): Person[] => {
  const personList: Person[] = [];
  const adjacencyList: Map<string, Set<string>> = createAdjacencyList(accounts);

  // Iterate through Accounts and merge or create a Person
  for (let i = 0; i < accounts.length; i++) {
    let person: Person;
    // Check each existing Person and consult adjacencyList
    let merged = false;
    for (let j = 0; j < personList.length && !merged; j++) {
      for (let k = 0; k < accounts[i].emails.length && !merged; k++) {
        let adjEmails = adjacencyList.get(accounts[i].emails[k]);
        for (let adjEmail of adjEmails) {
          // Accounts share an email, so merge
          if (personList[j].emails.includes(adjEmail)) {
            person = createPersonFromAccountAndPerson(accounts[i], personList[j]);
            personList[j] = person;
            merged = true;
            break;
          }
        }
      }
    }
    // We did not merge with an existing Person, so create
    if (!merged) {
      person = createPersonFromAccount(accounts[i]);
      personList.push(person);
    }
  }

  return personList;
};

export {
  mergeAccounts as default,
  createAdjacencyList,
  createPersonFromAccountAndPerson,
  createPersonFromAccount, 
  isSameAccount
};