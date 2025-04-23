using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DATLICHKHAM.Application.DichVu_ChuyenGia
{
    public class GetDichVuByChuyenGia
    {
        public class Query : IRequest<Result<IEnumerable<DLK_DichVu_ChuyenGia>>>
        {
            public int MaChuyenGia;
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_DichVu_ChuyenGia>>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_DichVu_ChuyenGia>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using(var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaChuyenGia", request.MaChuyenGia);
                        var result = await connection.QueryAsync<DLK_DichVu_ChuyenGia>("SP_Get_DichVuByChuyenGia", parameters, commandType: CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_DichVu_ChuyenGia>>.Success(result);
                    }
                    catch (Exception ex) { 
                        return Result<IEnumerable<DLK_DichVu_ChuyenGia>>.Failure(ex.Message);
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
