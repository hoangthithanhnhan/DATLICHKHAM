using Application.Core;
using Azure.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.DichVu_ChuyenGia
{
    public class Add
    {
        public class Command : IRequest<Result<DLK_DichVu_ChuyenGia>>
        {
            public DLK_DichVu_ChuyenGia Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_DichVu_ChuyenGia>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_DichVu_ChuyenGia>> Handle(Command request, CancellationToken cancellationToken)
            {
                using(var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaDichVu", request.Entity.MaDichVu);
                        parameters.Add("@MaChuyenGia", request.Entity.MaChuyenGia);
                        var result = await connection.QueryFirstOrDefaultAsync<DLK_DichVu_ChuyenGia>("SP_Add_DichVu_ChuyenGia", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_DichVu_ChuyenGia>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<DLK_DichVu_ChuyenGia>.Failure(ex.Message);
                    }
                    finally
                    {
                        await connection.CloseAsync();
                    }
                }
            }
        }
    }
}
