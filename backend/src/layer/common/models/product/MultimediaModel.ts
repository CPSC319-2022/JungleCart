import Model from '/opt/core/Model';
import {Multimedia, toMultimedia} from '/opt/models/product/types';

export class MultimediaModel extends Model {
    public read = async (productId: number): Promise<Multimedia[] | null> => {
        const sql = `SELECT * FROM dev.product_multimedia WHERE product_id='${productId}'`;

        const multimedia = await this.query(sql);

        return multimedia ? multimedia.map(toMultimedia) : null;
    };

    public update = async (productId: number, img: string[]): Promise<Multimedia[] | null> => {
        return null;
    }
}

export default new MultimediaModel();
