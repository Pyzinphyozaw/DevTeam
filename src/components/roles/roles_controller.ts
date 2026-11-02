import { Rights } from '../../utils/common';
export class RoleController {
  public addHandler() {
    // addHandler
  }
  public getAllHandler() {
    // getAllHandler
  }
  public getDetailsHandler() {
    // getDetailsHandler
  }
  public async updateHandler() {
    // updateHandler
  }
  public async deleteHandler() {
    // deleteHandler
  }
}

export class RolesUtil {
  /**
* Retrieves all possible permissions from the defined rights
in the Rights object.
* @returns {string[]} An array of permissions
*/
  public static getAllPermissionsFromRights(): string[] {
    // Initialize an empty array to collect values;
    let permissions: string[] = [];
    // Iterate through each section of the Rights object
    for (const module in Rights) {
      // Check if rights for ALL are defined for the current
      module;
      if (Rights[module]['ALL']) {
        let sectionValues = Rights[module]['ALL'];
        sectionValues = sectionValues.split(',');
        permissions = [...permissions, ...sectionValues];
      }
    }
    // Return the collected permissions
    return permissions;
  }
}
