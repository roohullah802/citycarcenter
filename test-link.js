const Linking = require('expo-linking');
console.log(Linking.createURL("/screens/Auth/SocialAuth", { scheme: "citycarcenter" }));
console.log(Linking.createURL("screens/Auth/SocialAuth", { scheme: "citycarcenter" }));
