const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/ApiResponse');
const productService = require('../services/productService');

const list = catchAsync(async (req, res) => {
  const { products, meta } = await productService.listProducts(req.query);
  sendSuccess(res, { data: { products }, meta });
});

const getById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  sendSuccess(res, { data: { product } });
});

const compare = catchAsync(async (req, res) => {
  const products = await productService.compareProducts(req.query.ids);
  sendSuccess(res, { data: { products } });
});

const create = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body, req.files, req.user._id);
  sendSuccess(res, { statusCode: 201, message: 'Product created', data: { product } });
});

const update = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.files);
  sendSuccess(res, { message: 'Product updated', data: { product } });
});

const remove = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  sendSuccess(res, { message: 'Product deleted' });
});

module.exports = { list, getById, compare, create, update, remove };
