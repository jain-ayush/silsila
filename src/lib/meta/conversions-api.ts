const bizSdk = require('facebook-nodejs-business-sdk');
const Content = bizSdk.Content;
const CustomData = bizSdk.CustomData;
const DeliveryCategory = bizSdk.DeliveryCategory;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const ServerEvent = bizSdk.ServerEvent;

const access_token = process.env.META_ACCESS_TOKEN;
const pixel_id = process.env.META_PIXEL_ID;

export const sendMetaEvent = async (
  eventName: string,
  eventSourceUrl: string,
  userData: {
    email?: string;
    phone?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbc?: string;
    fbp?: string;
  },
  customDataProps?: any
) => {
  if (!access_token || !pixel_id) {
    console.warn("Meta Pixel ID or Access Token missing. Skipping Conversions API event.");
    return;
  }

  try {
    const api = bizSdk.FacebookAdsApi.init(access_token);
    const userDataObj = new UserData()
      .setEmails(userData.email ? [userData.email] : [])
      .setPhones(userData.phone ? [userData.phone] : [])
      .setClientIpAddress(userData.clientIpAddress)
      .setClientUserAgent(userData.clientUserAgent)
      .setFbc(userData.fbc)
      .setFbp(userData.fbp);

    const customData = new CustomData();
    if (customDataProps) {
      if (customDataProps.value) customData.setValue(customDataProps.value);
      if (customDataProps.currency) customData.setCurrency(customDataProps.currency);
      if (customDataProps.content_ids) customData.setContentIds(customDataProps.content_ids);
      if (customDataProps.content_type) customData.setContentType(customDataProps.content_type);
    }

    const serverEvent = new ServerEvent()
      .setEventName(eventName)
      .setEventTime(Math.floor(Date.now() / 1000))
      .setUserData(userDataObj)
      .setCustomData(customData)
      .setEventSourceUrl(eventSourceUrl)
      .setActionSource('website');

    const eventsData = [serverEvent];
    const eventRequest = new EventRequest(access_token, pixel_id).setEvents(eventsData);

    const response = await eventRequest.execute();
    return response;
  } catch (error) {
    console.error("Meta Conversions API Error:", error);
  }
};
