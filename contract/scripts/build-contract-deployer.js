import { makeHelpers } from "@agoric/deploy-script-support";
import { getManifestForMastermind } from "../src/proposal.js";
import path from "path";


export const mastermindProposalBuilder = async ({ publishRef, install }) => {
  return harden({
    sourceSpec: "../src/proposal.js",
    getManifestCall: [
      getManifestForMastermind.name,
      {
        contractRef: publishRef(
          install("../src/index.js", "../bundles/bundle-mastermind.js", {
            persist: true,
          })
        ),
      },
    ],
  });
};

export default async (homeP, endowments) => {
  // const cacheDir = path.join(process.cwd(), "cache");
  // const { writeCoreProposal } = await makeHelpers(homeP, {
  //   cacheDir,
  //   ...endowments,
  // });
  // await writeCoreProposal("start-mastermind", mastermindProposalBuilder);
  const { writeCoreProposal } = await makeHelpers(homeP, endowments);
  await writeCoreProposal("start-mastermind", mastermindProposalBuilder);
};
