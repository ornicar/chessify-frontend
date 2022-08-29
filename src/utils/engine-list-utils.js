const ENGINES = [
  'stockfish10',
  'lc0',
  'asmfish',
  'sugar',
  'berserk',
  'koivisto',
  'houdini',
];

export const ENGINES_NAMES = {
  asmfish: 'AsmFish',
  stockfish10: 'Stockfish',
  sugar: 'Sugar AI',
  lc0: 'LCZero',
  houdini: 'Houdini',
  berserk: 'Berserk',
  koivisto: 'Koivisto',
};

export function getEnginesListFromAvailableServers(
  availableServers,
  userFullInfo
) {
  const subscription = userFullInfo.subscription ? userFullInfo.subscription : {};

  const orderedServers = {};
  const result = {};
  const servers = {
    asmfish: [8, 16, 32, 128],
    berserk: [8, 16, 32, 128],
    koivisto: [8, 16, 32, 128],
    sugar: [8, 16, 32, 128],
    houdini: [90],
    stockfish10: [8, 16, 32, 160, 352, 512],
    lc0: [100],
  };
  const orderedEngines = orderedServers && Object.keys(orderedServers);

  ENGINES.forEach((engine) => {
    if (orderedEngines.indexOf(engine) !== -1) {
      result[engine] = [orderedServers[engine][0]];
    } else {
      const res = [];
      const index = {};

      availableServers.forEach((s) => {
        if (servers[engine].indexOf(s.cores) !== -1) {
          if (!index[s.cores]) {
            index[s.cores] = true;
            res.push(s);
          }
        }
      });

      res.sort((a, b) => {
        return a.cores - b.cores;
      });

      if (res.length) {
        if (subscription && userFullInfo.balance <= 0) {
          res.push();
        } else {
          res.push(res.shift());
        }
        result[engine] = res;
      }
    }
  });
  return result;
}

export function coreToKNode(engineIndex, cores, selectedEngine) {
  const engine = engineIndex !== null ? ENGINES[engineIndex] : selectedEngine;
  const table = {
    sugar: {
      8: {
        average: '1,000',
        caption: '1 MN/s',
      },
      16: {
        average: '10,000',
        caption: '10 MN/s',
      },
      32: {
        average: '100,000',
        caption: '100 MN/s',
      },
      128: {
        average: '130,000',
        caption: '130 MN/s',
      },
    },
    houdini: {
      90: {
        average: '80,000',
        caption: '80 MN/s',
      },
    },
    stockfish10: {
      8: {
        average: '1,000',
        caption: '1 MN/s',
      },
      16: {
        average: '10,000',
        caption: '10 MN/s',
      },
      32: {
        average: '100,000',
        caption: '100 MN/s',
      },
      160: {
        average: '300,000',
        caption: '300 MN/s',
      },
      352: {
        average: '700,000',
        caption: '700 MN/s',
      },
      512: {
        average: '1,000,000',
        caption: '1 BN/s',
      },
      1024: {
        average: '2,000,000',
        caption: '2 BN/s',
      },
    },
    asmfish: {
      8: {
        average: '1,000',
        caption: '1 MN/s',
      },
      16: {
        average: '10,000',
        caption: '10 MN/s',
      },
      32: {
        average: '100,000',
        caption: '100 MN/s',
      },
      128: {
        average: '130,000',
        caption: '130 MN/s',
      },
    },
    berserk: {
      8: {
        average: '1,000',
        caption: '1 MN/s',
      },
      16: {
        average: '10,000',
        caption: '10 MN/s',
      },
      32: {
        average: '100,000',
        caption: '100 MN/s',
      },
      128: {
        average: '130,000',
        caption: '130 MN/s',
      },
    },
    koivisto: {
      8: {
        average: '1,000',
        caption: '1 MN/s',
      },
      16: {
        average: '10,000',
        caption: '10 MN/s',
      },
      32: {
        average: '100,000',
        caption: '100 MN/s',
      },
      128: {
        average: '130,000',
        caption: '130 MN/s',
      },
    },
    lc0: {
      100: {
        average: '100',
        caption: '100 kN/s',
      },
    },
    allie: {
      100: {
        average: '250',
        caption: '250 kN/s',
      },
    },
  };

  if (!table[engine] || !(cores in table[engine])) {
    return {
      average: '123,456',
      caption: '123 MN/s',
    };
  }

  return table[engine][cores];
}

export function disabledEngineCore(userFullInfo, core) {
  const { balance, subscription } = userFullInfo;

  if (core === 8) {
    if (!subscription) {
      return true;
    }
  }

  if (core === 16) {
    if (!subscription) {
      return false;
    }
    if (subscription) {
      if (
        parseInt(subscription.product_id) === 15 ||
        parseInt(subscription.product_id) === 16
      ) {
        return true;
      }
    }
  }

  if (core === 32) {
    if (
      !subscription ||
      parseInt(subscription.product_id) === 15 ||
      parseInt(subscription.product_id) === 16
    ) {
      return false;
    } else if (subscription) {
      return true;
    }
  }
  if (core > 32) {
    if (balance > 0) {
      return true;
    } else {
      return false;
    }
  }
}

export function showAnalizeButton(user, core, pricePerMinute) {
  const { subscription, balance } = user;

  if (core === 8) {
    return true;
  }

  if (core === 16) {
    if (subscription) {
      if (new Date(subscription.valid_till) >= Date.now()) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  if (core === 32) {
    if (
      !subscription ||
      parseInt(subscription.product_id) === 15 ||
      parseInt(subscription.product_id) === 16
    ) {
      return false;
    } else if (subscription) {
      if (new Date(subscription.valid_till) >= Date.now()) {
        return true;
      } else {
        return false;
      }
    }
  }

  if (core > 32) {
    if (balance > 0 && balance >= pricePerMinute) {
      return true;
    } else {
      return false;
    }
  }
}

export function getOrderedSeversInfoFromUserInfo(userFullInfo) {
  const servers = userFullInfo.servers || {};

  const result = [];

  if (Object.keys(servers).length > 0) {
    const serversName = Object.keys(servers);

    serversName.forEach((element) => {
      result.push({
        name: element,
        cores: servers[element][0].cores,
        price: servers[element][0].price_per_minute,
      });
    });
  }

  console.log(result);
  return result;
}
