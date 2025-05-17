using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;
using System.Data;

namespace DATLICHKHAM.Application.DanhGia
{
    public class GetsTop3DanhGia
    {
        public class Query: IRequest<Result<IEnumerable<DLK_DanhGia>>>
        {

        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_DanhGia>>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_DanhGia>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using(var connection= new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        var result = await connection.QueryAsync<DLK_DanhGia>("SP_Gets_TOP3DanhGia", commandType: CommandType.StoredProcedure);
                        return Result<IEnumerable<DLK_DanhGia>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_DanhGia>>.Failure(ex.Message);
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
