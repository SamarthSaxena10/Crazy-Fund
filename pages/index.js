import react, { useEffect, useContext, useState } from "react";

//internal import

import { CrowdFundingContext } from "../Context/CrowdFunding";
import { Hero, Card, PopUp } from "../Components";

const Index = () => {
  const {
    titleData,
    getCampaings,
    createCampaign,
    donate,
    getUserCampaigns,
    getDonations,
  } = useContext(CrowdFundingContext);

  const [allCampaigns, setAllCampaigns] = useState([]);
  const [userCampaigns, setUserCampaigns] = useState([]);

  useEffect(() => {
    const getCampaingsData = getCampaings();
    const userCampaignsData = getUserCampaigns();

    return async () => {
      const allData = await getCampaingsData;
      const userData = await userCampaignsData;
      setAllCampaigns(allData);
      setUserCampaigns(userData);
    };
  }, []);

  //Donate popup model

  const { openModel, setOpenModel } = useState(false);
  const [donateCampaign, setDonateCampaign] = useState();

  console.log(donateCampaign);

  return (
    <>
      <Hero titleData={titleData} createCampaign={createCampaign} />
      <Card
        title="All Campaigns"
        allCampaigns={allCampaigns}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />
      <Card
        title="My Campaigns"
        allCampaigns={userCampaigns}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />
      {openModel && (
        <PopUp
          setOpenModel={setOpenModel}
          getDonations={getDonations}
          donate={donateCampaign}
          donateFunction={donate}
        />
      )}
    </>
  );
};

export default Index;
