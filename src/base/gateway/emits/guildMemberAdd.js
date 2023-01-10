const UserManager = require("../../managers/UserManager");

module.exports = async (client, member) => {
  const modifiedMember = new UserManager(
    member,
    client.token,
    client.member.guild.id
  );

  if (client.options.forceCacheMembersOnJoin) {
    client.users.set(modifiedMember.id, modifiedMember);
  }

  return modifiedMember;
};
