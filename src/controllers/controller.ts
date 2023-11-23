import { Request, Response } from "express";
import { setDifference } from "../helpers";
import { EnumMap, IDoc, IDocument, IEnumModel, IModel } from "../models/model";
import mongoose, { UnpackedIntersection } from "mongoose";
import { HttpError, NotFound } from "../models/errors";

export async function seedEnum(collection: IEnumModel) {
  const documents = await collection.find();
  const docs = new Set<string>(documents.map((record) => record.name));
  const values = new Set<string>(collection.values);

  const toAdd = setDifference(values, docs);
  const toRemove = setDifference(docs, values);

  await collection.deleteMany({ name: { $in: [...toRemove] } });
  await collection.create([...toAdd].map((record) => ({ name: record })));
}

export function ReverseEnumMapping(model: IEnumModel) {
  let mapping: EnumMap | undefined;

  return async () => {
    if (!mapping) {
      const obj: { [k: string]: mongoose.Types.ObjectId } = {};

      for (const { name, _id } of await model.find()) {
        obj[name.toLowerCase()] = _id;
      }

      mapping = obj as unknown as EnumMap;
    }

    return mapping!;
  };
}

type Transform<T, O> = (doc: IDocument<T>) => Promise<O>;
type AtEnd<T> = (data: T[]) => T[];

export class ResourceController<T, O> {
  model: IModel<T>;
  populate: { path: string; select: string }[];
  transform?: Transform<T, O>;
  atEnd?: AtEnd<O>;

  constructor(
    model: IModel<T>,
    populate: [string, string][] = [],
    transform?: Transform<T, O>,
    atEnd?: AtEnd<O>,
  ) {
    this.model = model;
    this.populate = ResourceController.populated(populate);
    this.transform = transform;
    this.atEnd = atEnd;
  }

  async transformMany(resources: IDocument<T>[]) {
    const data = this.transform
      ? await Promise.all(resources.map(r => this.transform!(r)))
      : resources;

    return this.atEnd
      ? this.atEnd!(data as unknown as O[])
      : data;
  }

  async transformOne(resource: IDocument<T> | UnpackedIntersection<IDocument<T>, object>) {
    return this.transform
      ? await this.transform!(resource as unknown as IDocument<T>)
      : resource as unknown as O;
  }

  async getAll(req: Request, res: Response) {
    const resources = await this.model.find();

    res.status(200).json(await this.transformMany(resources));
  }

  async getResources(
    req: Request,
    res: Response,
    filters: object = {},
  ) {
    const limit = Number(req.query.limit ?? Number.MAX_SAFE_INTEGER);

    const resources = await this.model.find({ ...filters, disabled: false })
      .limit(limit)
      .populate(this.populate);

    res.status(200).json(await this.transformMany(resources));
  }

  async getResource(
    req: Request,
    res: Response,
    filters?: { [k: string]: unknown },
    err: HttpError = new NotFound(),
  ) {
    if (!filters) {
      filters = { _id: req.params.id, disabled: false };
    } else {
      filters.disabled = false;
    }

    const resource = await this.model.findOne(filters as object).populate(
      this.populate,
    );

    if (resource) {
      res.status(200).json(await this.transformOne(resource));
    } else {
      throw err;
    }
  }

  async createResource(req: Request, res: Response) {
    const resource = await this.model.create(req.body);

    res.status(200).json(await this.transformOne(resource));
  }

  async updateResource(
    req: Request,
    res: Response,
    err: HttpError = new NotFound(),
  ) {
    const id = req.body._id;
    delete req.body._id;
    delete req.body.disabled;

    const resource = await this.model.findOneAndUpdate(
      { _id: id, disabled: false },
      req.body,
      { new: true },
    ).populate(this.populate);

    if (resource) {
      res.status(200).json(await this.transformOne(resource));
    } else {
      throw err;
    }
  }

  async deleteResource(
    req: Request,
    res: Response,
    err: HttpError = new NotFound(),
  ) {
    const filters = { _id: req.params.id, disabled: false };
    const resource = await this.model.findOneAndUpdate(filters, {
      disabled: true,
    });

    if (resource) {
      res.status(200).json({
        status: 200,
        message: "Message: The resource has been successfully deleted",
      });
    } else {
      throw err;
    }
  }

  static populated(
    populate: [string, string][],
  ): { path: string; select: string }[] {
    return populate.map(([path, select]) => ({ path, select }));
  }
}
