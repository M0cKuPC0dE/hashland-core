import fs from 'fs';
// import { NFTStorage, File } from 'nft.storage';
import OSS from 'ali-oss';
import { BigNumber, utils } from 'ethers';
import sharp from 'sharp';

// const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY as string });

const client = new OSS({
    region: 'oss-ap-southeast-1',
    accessKeyId: process.env.accessKeyId as string,
    accessKeySecret: process.env.accessKeySecret as string,
    bucket: 'hashlandgamefi',
  });

function getRandomNumber(hnId: number, slot: string, base: number, range: number) {
    return BigNumber.from(utils.solidityKeccak256(['uint256', 'string'], [hnId, slot])).mod(range).add(base).toNumber();
}

async function generateImage(hnId: number, level: number) {
    const hnClass = getRandomNumber(hnId, 'class', 1, 4);

    const bg = sharp(`nft/materials/bg/${level}.png`).toBuffer();

    const materials = [
        `nft/materials/class${hnClass}/effect/bg/${level}.png`,
        `nft/materials/class${hnClass}/hero.png`,
        `nft/materials/class${hnClass}/item1/${getRandomNumber(hnId, 'item1', 1, 10)}.png`,
        `nft/materials/class${hnClass}/item2/${getRandomNumber(hnId, 'item2', 1, 10)}.png`,
        `nft/materials/class${hnClass}/effect/hero/${level}.png`,
        `nft/materials/class${hnClass}/info.png`
    ].reduce(async (input, overlay) => {
        return await sharp(await input).composite([{ input: overlay }]).toBuffer();
    }, bg);

    const composited = await sharp(await materials).sharpen().webp({ quality: 90 }).toBuffer();

    const result = await client.put(`nft/images/hashland-nft-${hnId}-${level}.png`, composited);
    console.log(result);
}

function generateImages(start: number, end: number) {
    for (let hnId = start; hnId < end; hnId++) {
        for (let level = 1; level <= 5; level++) {
            generateImage(hnId, level);
        }
    }
}

// async function uploadImages(start: number, end: number) {
//     const images = [];
//     for (let hnId = start; hnId < end; hnId++) {
//         for (let level = 1; level <= 5; level++) {
//             const fileName = `hashland-nft-${hnId}-${level}.png`;
//             const image = Buffer.from(fs.readFileSync(`nft/images/${fileName}`));
//             images.push(new File([image], fileName, { type: 'image/webp' }));
//         }
//     }

//     return await client.storeDirectory(images);
// }

async function generateMetadata(imagesCid: string, hnId: number, level: number) {
    const hnClass = getRandomNumber(hnId, 'class', 1, 4);
    const className = ['Cavalryman', 'Holy', 'Blade', 'Hex'];
    const heroName = ['Main Tank', 'Lady', 'Hunter', `Gul'dan`];
    const fileName = `hashland-nft-${hnId}-${level}`;

    const metadata = {
        name: `Hashland NFT #${hnId}`,
        description: 'Have you ever imagined an NFT with BTC hashrate? HashLand did it, and now he brings the first series of NFT - I AM MT.',
        image: `${imagesCid}/${fileName}.png`,
        attributes: [
            {
                trait_type: 'Ip',
                value: `I AM MT`,
            },
            {
                trait_type: 'Series',
                value: 'Basic',
            },
            {
                trait_type: 'Level',
                value: level,
            },
            {
                trait_type: 'Class',
                value: className[hnClass - 1],
            },
            {
                trait_type: 'Hero',
                value: heroName[hnClass - 1],
            },
        ],
    }

    const result = await client.put(`nft/metadatas/${fileName}.json`, Buffer.from(JSON.stringify(metadata)));
    console.log(result.url);
}

function generateMetadatas(imagesCid: string, start: number, end: number) {
    for (let hnId = start; hnId < end; hnId++) {
        for (let level = 1; level <= 5; level++) {
            generateMetadata(imagesCid, hnId, level);
        }
    }
}

// async function uploadMetadatas(start: number, end: number) {
//     const metadatas = [];
//     for (let hnId = start; hnId < end; hnId++) {
//         for (let level = 1; level <= 5; level++) {
//             const fileName = `hashland-nft-${hnId}-${level}.json`;
//             const json = fs.readFileSync(`nft/metadatas/${fileName}`).toString();
//             metadatas.push(new File([json], fileName));
//         }
//     }
//     return await client.storeDirectory(metadatas);
// }

async function main() {
    const start = 0;
    const end = 1000;

    // generateImages(start, end);
    // const newImageCID = await uploadImages(start, end);
    // console.log('New Image CID:', newImageCID);

    generateMetadatas('https://cdn.hashland.com/nft/images', start, end);
    // const newMetadataCID = await uploadMetadatas(start, end);
    // console.log('New Metadata CID:', newMetadataCID);
}

main();
