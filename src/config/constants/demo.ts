// currency icons
import nairaIcon from "assets/img/currency/naira.svg";
import dollarIcon from "assets/img/currency/dollar.svg";
import poundIcon from "assets/img/currency/pound.svg";
import cediIcon from "assets/img/currency/cedi.svg";
import euroIcon from "assets/img/currency/euro.svg";

// language icons
import chinaIcon from "assets/img/lang/china.svg";
import unitedKingdomIcon from "assets/img/lang/united-kingdom.svg";
import franceIcon from "assets/img/lang/france.svg";
import germanyIcon from "assets/img/lang/germany.svg";
import indiaIcon from "assets/img/lang/india.svg";
import portugalIcon from "assets/img/lang/portugal.svg";
import russiaIcon from "assets/img/lang/russia.svg";
import spainIcon from "assets/img/lang/spain.svg";
import turkeyIcon from "assets/img/lang/turkey.svg";

// connected
import copyIcon from "assets/img/icon/copy.svg";
import disconnectIcon from "assets/img/icon/disconnect.svg";
import mobileCopyIcon from "assets/img/icon/mobile-copy.svg";
import mobileDisconnectIcon from "assets/img/icon/mobile-disconnect.svg";

// methods
import bankIcon from "assets/img/icon/bank.svg";
import moneyGramIcon from "assets/img/icon/moneyGram.svg";

// my offer actions
import editIcon from "assets/img/icon/edit.svg";
import deleteIcon from "assets/img/icon/delete.svg";

import { FLAG } from "./nation_flag";

// payment methods
import multipleIcon from "assets/img/icon/multiple-payment.svg";
import interacIcon from "assets/img/icon/interac.svg";
import linkIcon from "assets/img/icon/link.svg";
import mykoboIcon from "assets/img/icon/mykobo.svg";
import cardIcon from "assets/img/icon/card.svg";
import mtPelerinIcon from "assets/img/icon/mt_pelerin.svg";
import mobileMoneyIcon from "assets/img/icon/mobileMoney.svg";
import billerIcon from "assets/img/icon/biller.svg";

export const CURRENCY = [
  {
    name: "Nigerian Naira",
    code: "NGN",
    icon: nairaIcon,
    mark: "₦",
  },
  {
    name: "U.S Dollar",
    code: "USD",
    icon: dollarIcon,
    mark: "$",
  },
  {
    name: "British Pound",
    code: "GBP",
    icon: poundIcon,
    mark: "£",
  },
  {
    name: "Euro",
    code: "EUR",
    icon: euroIcon,
    mark: "€",
  },
  {
    name: "Ghanaian Cedi",
    code: "CEDIS",
    icon: cediIcon,
    mark: "₵",
  },
];

export const LANGUAGE = [
  {
    name: "Chinese (Mandarin)",
    icon: chinaIcon,
  },
  {
    name: "English",
    icon: unitedKingdomIcon,
  },
  {
    name: "French",
    icon: franceIcon,
  },
  {
    name: "German",
    icon: germanyIcon,
  },
  {
    name: "Hindi",
    icon: indiaIcon,
  },
  {
    name: "Portugese",
    icon: portugalIcon,
  },
  {
    name: "Russian",
    icon: russiaIcon,
  },
  {
    name: "Spanish",
    icon: spainIcon,
  },
  {
    name: "Turkish",
    icon: turkeyIcon,
  },
];

export const CONNECTED = [
  {
    name: "Copy address",
    icon: copyIcon,
    mIcon: mobileCopyIcon,
  },
  {
    name: "Disconnect wallet",
    icon: disconnectIcon,
    mIcon: mobileDisconnectIcon,
  },
];

export const LOGOUT = [
  {
    name: "Log out",
    icon: disconnectIcon,
  },
];

export const TOP_METHOD = [
  {
    name: "Bank Transfer",
    sub: "Top up with your bank account",
    icon: bankIcon,
  },
  {
    name: "MoneyGram",
    sub: "Top Up from a MoneyGram station",
    icon: moneyGramIcon,
  },
];

export const WITHDRAW_METHOD = [
  {
    name: "Bank Account",
    sub: "Withdraw your stablecoin to your bank account",
    icon: bankIcon,
  },
  {
    name: "MoneyGram",
    sub: "Withdraw your stablecoin to a MoneyGram station",
    icon: moneyGramIcon,
  },
];

export const MY_OFFER_ACTION = [
  {
    name: "Edit offer",
    icon: editIcon,
  },
  {
    name: "Delete offer",
    icon: deleteIcon,
  },
];

export const SEND_DATA = {
  sIdx: 0,
  rIdx: 1,
  sAmount: "",
  rAmount: "",
  rate: 1,
  min: 1,
  max: 500,
  list: [],
};

export const SWAP_DATA = {
  sIdx: 0,
  rIdx: 1,
  fAmount: 0,
  tAmount: 0,
  slippage: 1,
  rate: 1
};

export const OFFER = {
  sIdx: 0,
  rIdx: 1,
  rate: 205.3,
  min: 10,
  max: 500,
};

export const BRIDGE = {
  sIdx: 0,
  rIdx: 0,
  sNet: 1,
  rNet: 3,
};

export const TOPUP = {
  sIdx: 0,
  rIdx: 0,
  method: 0,
};

export const WITHDRAW = {
  sIdx: 0,
  rIdx: 0,
  method: 0,
};

export const getMatch = (name: string) => {
  switch (name) {
    case "BRZ":
    case "BRL":
    case "BRLT":
      return FLAG["BRS"];
    case "EURC":
    case "EUROC":
    case "EURT":
    case "JEUR":
    case "EURS":
      return FLAG["EUR"];
    case "CADC":
    case "QCAD":
      return FLAG["CAD"];
    case "CNHC":
    case "TCNH":
      return FLAG["CNY"];
    case "USDC":
    case "USDT":
      return FLAG["USD"];
    case "ARS":
    case "ARST":
      return FLAG["ARS"];
    case "GBPT":
    case "TGBP":
      return FLAG["GBP"];
    case "GHSC":
      return FLAG["GHS"];
    case "TZS":
      return FLAG["TZS"];
    case "RWF":
      return FLAG["RWF"];
    case "KES":
      return FLAG["KES"];
    case "TRYB":
      return FLAG["TRY"];
    case "AUDD":
      return FLAG["AUD"];
    case "ZARP":
      return FLAG["ZAR"];
    case "NGNC":
      return FLAG["NGN"];
    default:
      return FLAG["USD"];
  }
};

export const getPaymentMethod = (
  network: string,
  token: string,
  type: string
) => {
  if (type === "topup") {
    switch (token) {
      case "ARST":
      case "AUDD":
      case "BRLT":
      case "BRZ":
      case "CNHC":
      case "GBPT":
      case "NGNC":
      case "TCNH":
      case "TGBP":
      case "TRYB":
      case "ZARP":
        return [
          {
            title: "Bank Transfer",
            sub: "Top up with your Bank Account",
            icon: bankIcon,
          },
        ];
      case "ARS":
      case "BRL":
        return [
          {
            title: "Multiple payment options",
            sub: "Bank Account, Cash, Card or Bill Payment ",
            icon: multipleIcon,
          },
        ];
      case "CADC":
        return [
          {
            title: "Bank Transfer",
            sub: "Top up with your Bank Account ",
            icon: bankIcon,
          },
          {
            title: "Interac",
            sub: "Top up with an Interac e-Transfer ",
            icon: interacIcon,
          },
        ];
      case "EURC":
        return [
          {
            title: "Bank Transfer",
            sub: "Top up with your Bank Account ",
            icon: bankIcon,
            child: [
              {
                title: "LINK",
                icon: linkIcon,
              },
              {
                title: "MYKOBO",
                icon: mykoboIcon,
              },
            ],
          },
        ];
      case "EUROC":
        return [
          {
            title: "Bank Transfer",
            sub: "Top up with your Bank Account ",
            icon: bankIcon,
            child: [
              {
                title: "LINK",
                icon: linkIcon,
              },
              {
                title: "Mt Pelerin",
                icon: mtPelerinIcon,
              },
            ],
          },
          {
            title: "Card",
            sub: "Top up with your Card",
            icon: cardIcon,
          },
        ];
      case "EURS":
      case "EURT":
        return [
          {
            title: "Bank Transfer",
            sub: "Top up with your Bank Account ",
            icon: bankIcon,
          },
          {
            title: "Card",
            sub: "Top up with your Card",
            icon: cardIcon,
          },
        ];
      case "GHSC":
        return [
          {
            title: "Mobile Money",
            sub: "Top up with your Mobile Money Wallet",
            icon: mobileMoneyIcon,
          },
        ];
      case "JEUR":
        if (network === "Polygon") {
          return [
            {
              title: "Bank Transfer",
              sub: "Top up with your Bank Account ",
              icon: bankIcon,
            },
            {
              title: "Card",
              sub: "Top up with your Card",
              icon: cardIcon,
            },
          ];
        } else {
          return [
            {
              title: "Bank Transfer",
              sub: "Top up with your Bank Account ",
              icon: bankIcon,
            },
          ];
        }
      case "KES":
      case "RWF":
      case "TZS":
        return [
          {
            title: "Bank Transfer",
            sub: "Top up with your Bank Account ",
            icon: bankIcon,
          },
          {
            title: "Mobile Money",
            sub: "Top up with your Mobile Money Wallet",
            icon: mobileMoneyIcon,
          },
        ];
      case "QCAD":
        return [
          {
            title: "Bank Transfer",
            sub: "Top up with your Bank Account ",
            icon: bankIcon,
          },
          {
            title: "Biller",
            sub: "Top up with your Biller ",
            icon: billerIcon,
          },
        ];
      case "USDC":
        if (network === "Stellar") {
          return [
            {
              title: "Bank Transfer",
              sub: "Top up with your Bank Account ",
              icon: bankIcon,
            },
            {
              title: "MoneyGram",
              sub: "Top up with your MoneyGram station ",
              icon: moneyGramIcon,
            },
          ];
        } else {
          return [
            {
              title: "Bank Transfer",
              sub: "Top up with your Bank Account ",
              icon: bankIcon,
              child: [
                {
                  title: "LINK",
                  icon: linkIcon,
                },
                {
                  title: "Mt Pelerin",
                  icon: mtPelerinIcon,
                },
              ],
            },
            {
              title: "Card",
              sub: "Top up with your Card",
              icon: cardIcon,
            },
          ];
        }
      case "USDT":
        if (
          network === "Ethereum" ||
          network === "Polygon" ||
          network === "Avalanche"
        ) {
          return [
            {
              title: "Bank Transfer",
              sub: "Top up with your Bank Account ",
              icon: bankIcon,
              child: [
                {
                  title: "LINK",
                  icon: linkIcon,
                },
                {
                  title: "Mt Pelerin",
                  icon: mtPelerinIcon,
                },
              ],
            },
            {
              title: "Card",
              sub: "Top up with your Card",
              icon: cardIcon,
            },
          ];
        } else {
          return [
            {
              title: "Bank Transfer",
              sub: "Top up with your Bank Account ",
              icon: bankIcon,
            },
          ];
        }
      default:
        return {
          title: "Bank Transfer",
          sub: "Top up with your Bank Account ",
          icon: bankIcon,
        };
    }
  } else {
    switch (token) {
      case "ARST":
      case "AUDD":
      case "BRLT":
      case "BRZ":
      case "CNHC":
      case "GBPT":
      case "NGNC":
      case "TCNH":
      case "TGBP":
      case "TRYB":
      case "ZARP":
        return [
          {
            title: "Bank Transfer",
            sub: "Withdraw to  your Bank Account",
            icon: bankIcon,
          },
        ];
      case "ARS":
      case "BRL":
        return [
          {
            title: "Multiple payment options",
            sub: "Bank Account, Cash, Card or Bill Payment ",
            icon: multipleIcon,
          },
        ];
      case "CADC":
        return [
          {
            title: "Bank Transfer",
            sub: "Withdraw to  your Bank Account ",
            icon: bankIcon,
          },
          {
            title: "Interac",
            sub: "Withdraw with an Interac e-Transfer",
            icon: interacIcon,
          },
        ];
      case "EURC":
        return [
          {
            title: "Bank Transfer",
            sub: "Withdraw to  your Bank Account",
            icon: bankIcon,
            child: [
              {
                title: "LINK",
                icon: linkIcon,
              },
              {
                title: "MYKOBO",
                icon: mykoboIcon,
              },
            ],
          },
        ];
      case "EUROC":
        return [
          {
            title: "Bank Transfer",
            sub: "Withdraw with your Bank Account ",
            icon: bankIcon,
            child: [
              {
                title: "LINK",
                icon: linkIcon,
              },
              {
                title: "Mt Pelerin",
                icon: mtPelerinIcon,
              },
            ],
          },
        ];
      case "EURS":
      case "EURT":
        return [
          {
            title: "Bank Transfer",
            sub: "Withdraw with your Bank Account ",
            icon: bankIcon,
          },
        ];
      case "GHSC":
        return [
          {
            title: "Mobile Money",
            sub: "Withdraw with your Mobile Money Wallet",
            icon: mobileMoneyIcon,
          },
        ];
      case "JEUR":
        if (network === "Polygon") {
          return [
            {
              title: "Bank Transfer",
              sub: "Withdraw with your Bank Account ",
              icon: bankIcon,
            },
          ];
        } else {
          return [
            {
              title: "Bank Transfer",
              sub: "Top up with your Bank Account ",
              icon: bankIcon,
            },
          ];
        }
      case "KES":
      case "RWF":
      case "TZS":
        return [
          {
            title: "Bank Transfer",
            sub: "Withdraw with your Bank Account ",
            icon: bankIcon,
          },
          {
            title: "Mobile Money",
            sub: "Withdraw with your Mobile Money Wallet",
            icon: mobileMoneyIcon,
          },
        ];
      case "QCAD":
        return [
          {
            title: "Bank Transfer",
            sub: "Withdraw with your Bank Account ",
            icon: bankIcon,
          },
          {
            title: "Biller",
            sub: "Withdraw with your Biller ",
            icon: billerIcon,
          },
        ];
      case "USDC":
        if (network === "Stellar") {
          return [
            {
              title: "Bank Transfer",
              sub: "Withdraw with your Bank Account ",
              icon: bankIcon,
            },
            {
              title: "MoneyGram",
              sub: "Withdraw with your MoneyGram station ",
              icon: moneyGramIcon,
            },
          ];
        } else {
          return [
            {
              title: "Bank Transfer",
              sub: "Withdraw with your Bank Account ",
              icon: bankIcon,
              child: [
                {
                  title: "LINK",
                  icon: linkIcon,
                },
                {
                  title: "Mt Pelerin",
                  icon: mtPelerinIcon,
                },
              ],
            },
          ];
        }
      case "USDT":
        if (
          network === "Ethereum" ||
          network === "Polygon" ||
          network === "Avalanche"
        ) {
          return [
            {
              title: "Bank Transfer",
              sub: "Withdraw with your Bank Account ",
              icon: bankIcon,
              child: [
                {
                  title: "LINK",
                  icon: linkIcon,
                },
                {
                  title: "Mt Pelerin",
                  icon: mtPelerinIcon,
                },
              ],
            },
            {
              title: "Card",
              sub: "Withdraw with your Card",
              icon: cardIcon,
            },
          ];
        } else {
          return [
            {
              title: "Bank Transfer",
              sub: "Withdraw with your Bank Account ",
              icon: bankIcon,
            },
          ];
        }
      default:
        return {
          title: "Bank Transfer",
          sub: "Withdraw with your Bank Account ",
          icon: bankIcon,
        };
    }
  }
};
