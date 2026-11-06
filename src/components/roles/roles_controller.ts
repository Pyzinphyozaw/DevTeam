import { Response, Request } from 'express';
import { RolesService } from './roles_service';
import { BaseController } from '../../utils/base_controller';
import { Rights } from '../../utils/common';
export class RoleController extends BaseController {
  public async addHandler(req: Request, res: Response): Promise<void> {
    console.log('BODY RECEIVED:', req.body);
    const role = req.body;
    const service = new RolesService();
    const result = await service.create(role);
    res.status(result.statusCode as number).json(result);
    return;
  }
  public async getAllHandler(req: Request, res: Response) {}
  public async getOneHandler(req: Request, res: Response) {}
  public async updateHandler(req: Request, res: Response) {}
  public async deleteHandler(req: Request, res: Response) {}
  public async getDetailsHandler(req: Request, res: Response) {
    // Add your logic here to fetch and return the role details
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
