import { Router, Request, Response, NextFunction } from 'express';
import { filterImageFromURL, deleteLocalFiles } from '../../../../util/util';

const router: Router = Router();

// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
router.get('/', async (req: Request, res: Response) => {
  let { image_url } = req.query;

  if (!image_url || image_url.length === 0) {
    return res.status(400).send(`image_url is required`);
  }

  try {
    const filteredpath: string = await filterImageFromURL(image_url as string);
    return res.sendFile(filteredpath, async (err) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        await deleteLocalFiles([filteredpath]);
      }
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

export const FilteredImageRouter: Router = router;
