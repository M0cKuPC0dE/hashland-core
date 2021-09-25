import { ethers } from 'hardhat';

export const one = ethers.constants.WeiPerEther;

export const token = {
    BTC: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    ETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    BNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    CAKE: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    MDX: '0x9C65AB58d8d978DB963e63f2bfB7121627e3a739',
    DOGE: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    USDT: '0x55d398326f99059fF775485246999027B3197955',
};

export const contract = {
    PancakeRouter: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    MdexRouter: '0x7DAe51BD3E3376B8c7c4900E9107f12Be3AF1bA8',
};