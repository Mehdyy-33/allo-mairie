
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.create = async (data) => {
  return await prisma.request.create({ data });
};

exports.getAll = async () => {
  return await prisma.request.findMany({ orderBy: { createdAt: 'desc' } });
};

exports.updateStatus = async (id, status) => {
  return await prisma.request.update({
    where: { id: parseInt(id) },
    data: { status }
  });
};

exports.delete = async (id) => {
  return await prisma.request.delete({
    where: { id: parseInt(id) }
  });
};

exports.getByUserId = async (userId) => {
  return await prisma.request.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};
