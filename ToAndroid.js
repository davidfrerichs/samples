import { AgentUtils } from './AgentUtils.js';
import EventBusInstance from './EventBus.js';
import UIStateInstance from './UIState.js';


class ToAndroid 
{
    constructor() 
    {
    }

    //OUTBOUND : GET FROM ANDROID
    getLocationFromAndroid() {

        var location_string = '';
        var location_object = null;

        if (UIStateInstance.data.MyAndroidInterface) 
        {
            location_string = this.sendDataToNative("getLocationData");
            location_object = AgentUtils.parseJson(location_string)[0];
            var location_point_object =
            {
                point: 
                {
                    lng: location_object.longitude,
                    lat: location_object.latitude
                }
            };
            AgentUtils.outputDebug("location from Android", location_string, 2);
            AgentUtils.outputDebug("location point object", JSON.stringify(location_point_object), 3);

            return location_point_object;

        }
        else 
        {
            AgentUtils.outputDebug("getLocationFromAndroid", "UIStateInstance.data.MyAndroidInterface is not available.");
            return false;
        }
    }

    //OUTBOUND : GET FROM ANDROID
    getAddressFromAndroid() 
    {
        var address_string = '';
        var address_object = null;

        if (UIStateInstance.data.MyAndroidInterface) {
            address_string = this.sendDataToNative("getAddress");
            AgentUtils.outputDebug("address string from Android", address_string, 2);
            if (address_string == '') 
            {
                AgentUtils.outputDebug("Android returned empty address :: location not determined yet", address_string, 1);
                return false;

            }
            else 
            {
                address_object = AgentUtils.parseJson(address_string);
                if (address_object.address.point.latitude) 
                {
                    address_object.address.point.lat = address_object.address.point.latitude;
                    address_object.address.point.lng = address_object.address.point.longitude;
                    delete address_object.address.point.latitude;
                    delete address_object.address.point.longitude;
                    delete address_object.address.type;
                }
                AgentUtils.outputDebug("address object", JSON.stringify(address_object), 3);

                return address_object;
            }

        }
        else 
        {
            AgentUtils.outputDebug("getAddressFromAndroid", "UIStateInstance.data.MyAndroidInterface is not available.");
            return false;
        }

    }

    //WRAPPER : GET FROM WEBVIEW
    getDeviceTime() 
    {
        //var deviceTime = UIStateInstance.data.MyAndroidInterface.getDeviceTime();
        var javascriptISOTime = AgentUtils.toIsoString(new Date());
        AgentUtils.outputDebug("Javascript ISO 8601", javascriptISOTime, 2);
        return javascriptISOTime;
    }

    //OUTBOUND : GET FROM ANDROID
    getDeviceFullStateFromAndroid() 
    {
        var device_state_string = '';
        var device_state_object = null;

        if (UIStateInstance.data.MyAndroidInterface) 
        {
            device_state_string = this.sendDataToNative("getFullState");
            AgentUtils.outputDebug("getDeviceFullStateFromAndroid", "state string: " + device_state_string, 2);
            if (device_state_string == '') 
            {
                AgentUtils.outputDebug("getDeviceFullStateFromAndroid", "empty_string_returned", 2);
                return false;
            }
            else 
            {
                device_state_object = AgentUtils.parseJson(device_state_string);
                if (AgentUtils.validateNestedProperty(device_state_object, 'address.address.point.latitude')) 
                {
                    device_state_object.address.address.point.lat = device_state_object.address.address.point.latitude;
                    device_state_object.address.address.point.lng = device_state_object.address.address.point.longitude;
                    delete device_state_object.address.address.point.latitude;
                    delete device_state_object.address.address.point.longitude;
                    delete device_state_object.address.address.type;
                }
                else 
                {
                    if (AgentUtils.validateNestedProperty(device_state_object, 'address')) 
                    {
                        delete device_state_object.address;
                    }
                }
                return device_state_object;
            }
        }
        else 
        {
            AgentUtils.outputDebug("getDeviceFullStateFromAndroid", "UIStateInstance.data.MyAndroidInterface is not available.");
            return false;
        }

    }

    //OUTBOUND: GET FROM ANDROID
    getLanguageFromAndroid() 
    {
        return this.sendDataToNative("getLanguage");
    }

    //OUTBOUND: PUT TO ANDROID
    setLanguageToAndroid(language) 
    {
        return this.sendDataToNative("setLanguage", language);
    }

    //OUTBOUND : PUT TO ANDROID
    sendMessageToAndroid(message_to_send) 
    {
        if (message_to_send == '') 
        {
            message_to_send = "Hi, I am Agent, here to help.";
        }
        if (UIStateInstance.data.MyAndroidInterface) 
        {
            this.sendDataToNative("showMessage", message_to_send);
            return true;
        }
        else 
        {
            AgentUtils.outputDebug("sendMessageToAndroid", "UIStateInstance.data.MyAndroidInterface is not available.");
            return false;
        }
    }

    //OUTBOUND : PUT TO ANDROID
    sendTTSToAndroid(tts_text_to_send) 
    {
        if (tts_text_to_send == "") 
        {
            tts_text_to_send = "Hi, I am Agent, here to help.";
        }
        if (UIStateInstance.data.MyAndroidInterface) 
        {
            this.sendDataToNative("doTTS", tts_text_to_send);
            AgentUtils.outputDebug("sendTTSToAndroid", "TTS started", 1);
            return true;
        }
        else 
        {
            AgentUtils.outputDebug("sendTTSToAndroid", "UIStateInstance.data.MyAndroidInterface is not available.");
            return false;
        }
    }

    //OUTBOUND : PUT TO ANDROID
    remoteTTSToAndroid(tts_uri) 
    {

        if (UIStateInstance.data.MyAndroidInterface) 
        {
            this.sendDataToNative("playRemoteTTS", tts_uri);
            AgentUtils.outputDebug("remoteTTSToAndroid", "remote TTS started", 1);
            AgentUtils.outputDebug("remoteTTSToAndroid", tts_uri, 1);

            return true;
        }
        else 
        {
            AgentUtils.outputDebug("remoteTTSToAndroid", "UIStateInstance.data.MyAndroidInterface is not available.");
            return false;
        }
    }


    //OUTBOUND : PUT TO ANDROID
    startWWEToAndroid() 
    {
        if (UIStateInstance.data.MyAndroidInterface) 
        {
            this.sendDataToNative("listenForWakeWord", true);
            if (UIStateInstance.data.wwe_enabled == false) 
            {
                AgentUtils.outputDebug("startWWEToAndroid", "start listening", 0);
                UIStateInstance.data.wwe_enabled = true;
                return true;
            }
            else 
            {
                AgentUtils.outputDebug("startWWEToAndroid", "wwe_enabled already = true in JS, but we set again anyway", 0);
                return true;
            }
        }
        else 
        {
            AgentUtils.outputDebug("startWWEToAndroid", "UIStateInstance.data.MyAndroidInterface is not available.");
            return false;
        }

    }

    //OUTBOUND : PUT TO ANDROID
    stopWWEToAndroid() 
    {
        if (UIStateInstance.data.MyAndroidInterface) 
        {
            this.sendDataToNative("listenForWakeWord", false);
            AgentUtils.outputDebug("stopWWEToAndroid", "stop listening", 0);
            UIStateInstance.data.wwe_enabled = false;
            return true;
        }
        else 
        {
            AgentUtils.outputDebug("stopWWEToAndroid", "UIStateInstance.data.MyAndroidInterface is not available.");
            return false;
        }
    }

    //OUTBOUND : PUT TO ANDROID
    stopTTSToAndroid() 
    {
        if (UIStateInstance.data.MyAndroidInterface) 
        {
            //The JS Interface is single-threaded, avoid multiple sequential calls
            this.sendDataToNative("stopRemoteTTS");
            AgentUtils.outputDebug("stopTTSToAndroid", "stop all TTS", 0);
            return true;

        }
        else 
        {
            AgentUtils.outputDebug("stopTTSToAndroid", "UIStateInstance.data.MyAndroidInterface is not available.");
            return false;
        }
    }

    //OUTBOUND : PUT TO ANDROID
    resumeListeningToAndroid() 
    {

        if (UIStateInstance.data.MyAndroidInterface) 
        {
            //AgentUtils.outputDebug("resumeListeningToAndroid", "calling stopWWE after this message");
            //this.stopWWEToAndroid();
            EventBusInstance.emit('interaction_state','listening');
            //AgentUtils.outputDebug("resumeListeningToAndroid", "calling stopTTS after this message");
            //this.stopTTSToAndroid();
            AgentUtils.outputDebug("resumeListeningToAndroid", "ASR asked to resume after this message");
            this.sendDataToNative("resumeListening");
            return true; 
        }
        else 
        {
            AgentUtils.outputDebug("resumeListeningToAndroid", "UIStateInstance.data.MyAndroidInterface is not available.");
            return false;
        }

    }

    //OUTBOUND : PUT TO ANDROID
    sendRemoteAudioToAndroid(uri) 
    {
        return this.sendDataToNative("playRemoteAudio", uri);
    }

    //OUTBOUNT TO ANDROID: single interface to send or get data
    sendDataToNative(action, value = null) 
    {
        if (UIStateInstance.data.MyAndroidInterface) 
        {
            if (value == null) 
            {
                return UIStateInstance.data.MyAndroidInterface.sendDataToNative(action);
            }
            else 
            {
                value = String(value);
                return UIStateInstance.data.MyAndroidInterface.sendDataToNative(action, value);
            }
        }
        else 
        {
            AgentUtils.outputDebug(action, "UIStateInstance.data.MyAndroidInterface is not available.");
            return false;
        }
    }
}

export default ToAndroid;
